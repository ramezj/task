import { createClient } from "@supabase/supabase-js";

import { env } from "../config/env.js";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

const TEST_CREDENTIALS = {
  admin: {
    email: "admin@test.com",
    password: "admin12345",
    name: "Admin",
    role: "admin",
  },
  customer: {
    email: "customer@test.com",
    password: "customer12345",
    name: "Customer",
    role: "user",
  },
} as const;

const CATEGORY_SEEDS = [
  { name: "Electronics", slug: "electronics" },
  { name: "Accessories", slug: "accessories" },
  { name: "Home Office", slug: "home-office" },
] as const;

const PRODUCT_SEEDS = [
  {
    name: "Aurora Noise-Canceling Headphones",
    description: "Wireless over-ear headphones with active noise cancellation and 30-hour battery life.",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    categorySlug: "electronics",
  },
  {
    name: "Pulse Smart Speaker",
    description: "Compact smart speaker with room-filling sound and voice assistant support.",
    price: 129.0,
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230",
    categorySlug: "electronics",
  },
  {
    name: "Orbit Portable Charger",
    description: "10,000mAh USB-C power bank with fast charging for phones and tablets.",
    price: 49.5,
    imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
    categorySlug: "electronics",
  },
  {
    name: "Canvas Everyday Tote",
    description: "Durable carry-all tote with reinforced straps and internal organizer pocket.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    categorySlug: "accessories",
  },
  {
    name: "Slate Minimal Wallet",
    description: "Slim wallet with RFID protection and quick-access card slot.",
    price: 39.95,
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93",
    categorySlug: "accessories",
  },
  {
    name: "Summit Stainless Bottle",
    description: "Double-wall insulated bottle that keeps drinks cold for 24 hours.",
    price: 24.0,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
    categorySlug: "accessories",
  },
  {
    name: "Nimbus Desk Lamp",
    description: "Adjustable LED desk lamp with warm-to-cool light modes and touch controls.",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    categorySlug: "home-office",
  },
  {
    name: "Atlas Laptop Stand",
    description: "Aluminum laptop stand for improved posture and heat dissipation.",
    price: 44.75,
    imageUrl: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d",
    categorySlug: "home-office",
  },
  {
    name: "Drift Wireless Keyboard",
    description: "Low-profile wireless keyboard with multi-device pairing.",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
    categorySlug: "home-office",
  },
  {
    name: "Focus Felt Desk Pad",
    description: "Large felt desk pad that protects surfaces and softens your workspace.",
    price: 28.5,
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    categorySlug: "home-office",
  },
] as const;

type SeedUser = (typeof TEST_CREDENTIALS)[keyof typeof TEST_CREDENTIALS];

async function findUserByEmail(email: string) {
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw error;
    }

    const user = data.users.find((entry) => entry.email === email);

    if (user) {
      return user;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }
}

async function ensureUser(seedUser: SeedUser) {
  const existingUser = await findUserByEmail(seedUser.email);

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      email: seedUser.email,
      password: seedUser.password,
      email_confirm: true,
      user_metadata: {
        name: seedUser.name,
        full_name: seedUser.name,
      },
    });

    if (error) {
      throw error;
    }

    await ensureProfile(data.user.id, seedUser);
    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: seedUser.email,
    password: seedUser.password,
    email_confirm: true,
    user_metadata: {
      name: seedUser.name,
      full_name: seedUser.name,
    },
  });

  if (error) {
    throw error;
  }

  await ensureProfile(data.user.id, seedUser);
  return data.user;
}

async function ensureProfile(userId: string, seedUser: SeedUser) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      name: seedUser.name,
      role: seedUser.role,
    },
    {
      onConflict: "id",
    },
  );

  if (error) {
    throw error;
  }
}

async function ensureCategories() {
  const categoryIdBySlug = new Map<string, string>();

  for (const category of CATEGORY_SEEDS) {
    const { data, error } = await supabase
      .from("categories")
      .upsert(category, { onConflict: "slug" })
      .select("id, slug")
      .single();

    if (error) {
      throw error;
    }

    categoryIdBySlug.set(data.slug, data.id);
  }

  return categoryIdBySlug;
}

async function ensureProducts(categoryIdBySlug: Map<string, string>) {
  for (const product of PRODUCT_SEEDS) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);

    if (!categoryId) {
      throw new Error(`Missing category for slug: ${product.categorySlug}`);
    }

    const { data: existing, error: selectError } = await supabase
      .from("products")
      .select("id")
      .eq("name", product.name)
      .maybeSingle();

    if (selectError) {
      throw selectError;
    }

    const payload = {
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.imageUrl,
      category_id: categoryId,
      is_active: true,
    };

    if (existing) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", existing.id);

      if (error) {
        throw error;
      }

      continue;
    }

    const { error } = await supabase.from("products").insert(payload);

    if (error) {
      throw error;
    }
  }
}

async function main() {
  console.log("Seeding users...");
  const adminUser = await ensureUser(TEST_CREDENTIALS.admin);
  const customerUser = await ensureUser(TEST_CREDENTIALS.customer);

  console.log("Seeding categories...");
  const categoryIdBySlug = await ensureCategories();

  console.log("Seeding products...");
  await ensureProducts(categoryIdBySlug);

  console.log("Seed complete.");
  console.log("");
  console.log("Test credentials:");
  console.log(`Admin:    ${TEST_CREDENTIALS.admin.email} / ${TEST_CREDENTIALS.admin.password}`);
  console.log(`Customer: ${TEST_CREDENTIALS.customer.email} / ${TEST_CREDENTIALS.customer.password}`);
  console.log("");
  console.log(`Admin user id: ${adminUser.id}`);
  console.log(`Customer user id: ${customerUser.id}`);
}

main().catch((error) => {
  console.error("Seed failed.");
  console.error(error);
  process.exit(1);
});
