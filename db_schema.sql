-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  role text default 'CUSTOMER',
  is_blocked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CATEGORIES
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  category text,
  image text,
  stock integer default 0,
  sizes text[],
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS
create table public.orders (
  id text primary key, -- Custom ID like ORD-123456
  user_id uuid references public.profiles(id),
  items jsonb,
  total_amount numeric,
  discount_amount numeric,
  shipping_cost numeric,
  promo_code text,
  status text default 'PENDING',
  shipping_address text,
  contact_number text,
  payment_method text,
  payment_status text default 'PENDING',
  transaction_id text,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROMOS
create table public.promos (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  type text not null, -- 'PERCENTAGE' or 'FIXED'
  value numeric not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NOTICES
create table public.notices (
  id uuid default uuid_generate_v4() primary key,
  message text not null,
  type text default 'INFO',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security) - Optional for demo but recommended
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.categories enable row level security;
alter table public.promos enable row level security;
alter table public.notices enable row level security;

-- Policies (Simplified for demo: Public Read, Admin Write)
-- Products: Everyone can read, Admin can all
create policy "Public products are viewable by everyone." on products for select using (true);
create policy "Admins can insert products" on products for insert with check (auth.uid() in (select id from profiles where role = 'ADMIN'));
create policy "Admins can update products" on products for update using (auth.uid() in (select id from profiles where role = 'ADMIN'));
create policy "Admins can delete products" on products for delete using (auth.uid() in (select id from profiles where role = 'ADMIN'));

-- Categories: Everyone read, Admin write
create policy "Public categories viewable" on categories for select using (true);
create policy "Admin categories insert" on categories for insert with check (auth.uid() in (select id from profiles where role = 'ADMIN'));
create policy "Admin categories delete" on categories for delete using (auth.uid() in (select id from profiles where role = 'ADMIN'));

-- Orders: Users can see own, Admin can see all
create policy "Users can see own orders" on orders for select using (auth.uid() = user_id);
create policy "Admins can see all orders" on orders for select using (auth.uid() in (select id from profiles where role = 'ADMIN'));
create policy "Users can insert orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admins can update orders" on orders for update using (auth.uid() in (select id from profiles where role = 'ADMIN'));

-- Profiles: Public read (for simple checks), Users update own
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Promos/Notices: Public read, Admin write
create policy "Public read promos" on promos for select using (true);
create policy "Admin write promos" on promos for all using (auth.uid() in (select id from profiles where role = 'ADMIN'));

create policy "Public read notices" on notices for select using (true);
create policy "Admin write notices" on notices for all using (auth.uid() in (select id from profiles where role = 'ADMIN'));

-- Trigger for new user profile creation
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', 'CUSTOMER');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
