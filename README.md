## Tugas Akhir - Studi Kasus Restaurant Menu


### How to run
1. Clone Project
2. Run to install node modules: `npm run install`
3. Run application in env development: `npm run start-dev`
4. Run application in env production: `npm run prod`


### Prisma Command
1. Migrate: `npx prisma migrate dev --name init`
2. Update Migrate: `npx prisma migrate dev --name added_your_field`


### Struktur Database

#### 1. **Tabel `Category`**
Kategori menu, seperti makanan utama, minuman, makanan pembuka, dll.

| id  | name          |
|-----|---------------|
| 1   | Main Course   |
| 2   | Appetizer     |
| 3   | Dessert       |
| 4   | Beverage      |

#### 2. **Tabel `Menu`**
Menyimpan detail setiap item di menu, termasuk kategori dan harga.

| id  | name            | description                  | price | category_id (FK) |
|-----|-----------------|------------------------------|-------|------------------|
| 1   | Grilled Chicken | Juicy grilled chicken breast. | 50.00 | 1                |
| 2   | Caesar Salad    | Fresh salad with Caesar sauce.| 25.00 | 2                |
| 3   | Ice Cream       | Vanilla flavored ice cream.   | 15.00 | 3                |
| 4   | Coke            | Chilled carbonated soft drink.| 10.00 | 4                |
| 5   | Latte           | Fresh brewed coffee with milk.| 20.00 | 4                |
| 6   | Vegan Burger    | Plant-based burger patty.     | 45.00 | 1                |

#### 3. **Tabel `Topping`**
Menyimpan topping atau add-ons yang dapat ditambahkan ke item menu, seperti saus, keju tambahan, dll.

| id  | name            | price |
|-----|-----------------|-------|
| 1   | Extra Cheese    | 5.00  |
| 2   | Chocolate Syrup | 3.00  |
| 3   | Whipped Cream   | 2.00  |
| 4   | Bacon Strips    | 7.00  |


#### 4. **Tabel `MenuToppings`**
Menyimpan menu dan topping yang relasinya many-to-many.

| id  | menuId      | toppingId |
|-----|-------------|-----------|
| 1   | 1           | 5         |
| 2   | 1           | 3         |
| 3   | 2           | 2         |
| 4   | 2           | 7         |

#### 5. **Tabel `SpecialMenu`**
Menyimpan menu spesial yang diberikan restoran, seperti menu rekomendasi dari koki atau menu musiman.

| id  | name             | menu_item_id (FK) | special_type     |
|-----|------------------|-------------------|------------------|
| 1   | Chef's Special   | 1 (Grilled Chicken)| Chef's Recommendation |
| 2   | Seasonal Special | 6 (Vegan Burger)   | Seasonal Menu     |


### Implementasi ER Diagram

+---------------------+         +---------------------+         +----------------------+
|     Category        | 1      *|      Menu           | *      *|      Topping/Add-ons |
+---------------------+         +---------------------+         +----------------------+
| id (PK)             |---------| id (PK)             |---------| id (PK)              |
| name                |         | name                |         | name                 |
+---------------------+         | description         |         | price                |
                                | price               |         | applicable_to_menu_item (FK)|
                                | category_id (FK)    |         +----------------------+
                                +---------------------+                   ^
                                                                          |
                                                                          |
                                                              +----------------------+
                                                              |     SpecialMenu      |
                                                              +----------------------+
                                                              | id (PK)              |
                                                              | menu_item_id (FK)    |
                                                              | special_type         |
                                                              +----------------------+
