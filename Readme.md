# REST API MENGGUNAKAN JWT 

Penggunaan JWT pada REST API ini memungkinkan user untuk memiliki kemampuan mengakses server yang berbeda-beda dengan access token yang sama, sehingga tidak membebankan server authentifikasi ketika banyak user yang login bersamaan

---


## 1. LOGIN


**POST** request pada `http://localhost:3000/login/`

Kirim data dengan format JSON yang berisi username dan password, contohnya ialah

- Content :
```json
{
	"username" : "user123",
	"password" : "123"
}
```

#### RESPON SUKSES

Ketika berhasil login, pengguna akan diberikan access token dan refresh token
```json
{
    "auth": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxlbGVrdW5pbmciLCJpYXQiOjE2NDYxODYxMzMsImV4cCI6MTY0NjE4NjE2M30.zqRsUMM0RpctAMHMT23OtGVd67rnHcgVV2M73uFcD0E",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxlbGVrdW5pbmciLCJpYXQiOjE2NDYxODYxMzMsImV4cCI6MTY0NjE4NjE5M30.YAStsmoOCRPHYDHbRPcmczILQFVKHFLxV_5aVaucAG8"
}
```

#### RESPON GAGAL

- Jika pengguna salah memasukkan username atau password, pengguna akan diberikan output berupa :

``` 
Username is invalid
```

atau

```
Password is invalid
```

- Jika belum terdaftar maka akan diberikan output berupa:
```
Login failed
```

---

## 2. REGISTER

**POST** request pada `http://localhost:3000/register/`

Kirim data dengan format JSON yang berisi username dan password, contohnya ialah

- Content
```json
{
	"username" : "user123",
	"password" : "123"
}
```

#### RESPON SUKSES

Ketika berhasil login, pengguna akan diberikan access token dan refresh token
```json
{
    "auth": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxlbGVrdW5pbmciLCJpYXQiOjE2NDYxODYxMzMsImV4cCI6MTY0NjE4NjE2M30.zqRsUMM0RpctAMHMT23OtGVd67rnHcgVV2M73uFcD0E",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxlbGVrdW5pbmciLCJpYXQiOjE2NDYxODYxMzMsImV4cCI6MTY0NjE4NjE5M30.YAStsmoOCRPHYDHbRPcmczILQFVKHFLxV_5aVaucAG8"
}
```

#### RESPON GAGAL

- Jika pengguna belum terdaftar, salah memasukkan username atau password, pengguna akan diberikan output berupa :
``` 
Sign Up failed
```

- Jika username pengguna telah terdaftar maka akan menampilkan output berupa
``` 
Your username was used.
```

---

## 3. TOKEN

**GET** request pada `http://localhost:3000/token/`

Untuk memeriksa access token masih berlaku atau tidak
- Caranya dengan membuka Workspace pada aplikasi POSTMAN, lalu mencopy accessToken kepada menu Authorization > Type > Bearer Token > Copy accessToken pada kolom Token


#### RESPON SUKSES

```json
{
    "data": {
        "username": "user123",
        "iat": 1655005356,
        "exp": 1655008956
    }
}
```

#### RESPON GAGAL

```json
{
    "auth": false,
    "accessToken": "expired"
}
```

**GET** request pada `http://localhost:3000/refreshToken/`

Untuk mendapatkan accessToken kembali 

- Caranya dengan membuka Workspace pada aplikasi POSTMAN, lalu mencopy refreshToken kepada menu Authorization > Type > Bearer Token > Copy refreshToken pada kolom Token

#### RESPON SUKSES

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hc2lnb3JlbmciLCJpYXQiOjE2NTUwMDYwOTgsImV4cCI6MTY1NTAwOTY5OH0.VyHeygTRvk6UJgxHfCJKRdh2-E_3IHB-XL8_Ry9UqxI"
}
```

#### RESPON GAGAL

```
Please relogin
```

---

## 4. LOGOUT

**POST** request pada `http://localhost:3000/logout/`
 
Kirim data dengan format JSON yang berisi username dan password, contohnya ialah
- Content

```json
{
	"username" : "user123"
}
```

#### RESPON SUKSES

```
Logout success
```

#### RESPON GAGAL

```
Logout failed
```
---

!!! Catatan: Setelah melakukan registrasi atau login, pengguna akan diberikan accessToken yang dapat digunakan pada server yang berbeda. Pada contoh kali ini, pengguna dapat mengakses data product menggunakan accessToken yang telah diberikan pada server yang berjalan di `http://localhost:4000` yang sebelumnya berjalan pada `http://localhost:3000/`

**GET** request pada `http://localhost:4000/product/`

Menampilkan seluruh list product

**RESPON SUKSES**
```json
[
    {
        "_id": "62a5588fa94367688471091b",
        "productName": "nasigoreng",
        "price": 15000,
        "category": "food",
        "__v": 0
    },
    {
        "_id": "62a558a8a94367688471091f",
        "productName": "miegoreng",
        "price": 5000,
        "category": "food",
        "__v": 0
    },
    {
        "_id": "62a55ae273a882fe14fece3d",
        "productName": "teh manis",
        "price": 30000,
        "category": "drink",
        "__v": 0
    }
]
```

**RESPON GAGAL**
```json
{
    "auth": false,
    "accessToken": "expired"
}
```

**POST** request pada `http://localhost:4000/product/`

Menambahkan data product dengan mengirim data format JSON yang berisi productName, price, dan category
- Content
```json
{
    "productName": "ayam bakar",
    "price": "20000",
    "category": "food"
}
```

**RESPON SUKSES**
```json
[
    {
        "_id": "62a5588fa94367688471091b",
        "productName": "nasigoreng",
        "price": 15000,
        "category": "food",
        "__v": 0
    },
    {
        "_id": "62a558a8a94367688471091f",
        "productName": "miegoreng",
        "price": 5000,
        "category": "food",
        "__v": 0
    },
    {
        "_id": "62a55ae273a882fe14fece3d",
        "productName": "teh manis",
        "price": 30000,
        "category": "drink",
        "__v": 0
    },
    {
        "_id": "62a568e5c8498ea6c4ae67d2",
        "productName": "ayam bakar",
        "price": 20000,
        "category": "food",
        "__v": 0
    }
]
```

**RESPON GAGAL**
```json
{
    "auth": false,
    "accessToken": "expired"
}
```
---

**PUT** request pada `http://localhost:4000/product/`

Merubah data product dengan menimpa data sebelumnya
- Content
```json
{
    "productName": "ayam bakar",
    "price": 15000
}
```

**RESPON SUKSES**
```json
[
    {
        "_id": "62a5588fa94367688471091b",
        "productName": "nasigoreng",
        "price": 150000,
        "category": "food",
        "__v": 0
    },
    {
        "_id": "62a558a8a94367688471091f",
        "productName": "miegoreng",
        "price": 50000,
        "category": "food",
        "__v": 0
    },
    {
        "_id": "62a55ae273a882fe14fece3d",
        "productName": "teh manis",
        "price": 30000,
        "category": "drink",
        "__v": 0
    },
    {
        "_id": "62a568e5c8498ea6c4ae67d2",
        "productName": "ayam bakar",
        "price": 15000,
        "__v": 0
    }
]
```

**RESPON GAGAL**
```json
{
    "auth": false,
    "accessToken": "expired"
}
```


---

**PACTH** request pada `http://localhost:4000/product/`

Merubah data product tanpa menimpa data sebelumnya
- Content
```json
{
    "productName": "teh manis",
    "price": 3000
}
```

**RESPON SUKSES**
```json
[
    {
        "_id": "62a5588fa94367688471091b",
        "productName": "nasigoreng",
        "price": 15000,
        "category": "food",
        "__v": 0
    },
    {
        "_id": "62a558a8a94367688471091f",
        "productName": "miegoreng",
        "price": 5000,
        "category": "food",
        "__v": 0
    },
    {
        "_id": "62a55ae273a882fe14fece3d",
        "productName": "teh manis",
        "price": 3000,
        "category": "drink",
        "__v": 0
    },
    {
        "_id": "62a568e5c8498ea6c4ae67d2",
        "productName": "ayam bakar",
        "price": 15000,
        "__v": 0
    }
]
```

**RESPON GAGAL**
```json
{
    "auth": false,
    "accessToken": "expired"
}
```

---

**DELETE** request pada `http://localhost:4000/product/:productName`

Menghapus data product dengan menggunakan parameter URL, dengan format`http://localhost:3000/product/:productName`. Bila nama product memiliki spasi maka harus diganti dengan tanda (-)

Contohnya `http://localhost:3000/product/:ayam-bakar`

**RESPON SUKSES**
```json
[
    {
        "_id": "62a5588fa94367688471091b",
        "productName": "nasigoreng",
        "price": 15000,
        "category": "food",
        "__v": 0
    },
    {
        "_id": "62a558a8a94367688471091f",
        "productName": "miegoreng",
        "price": 5000,
        "category": "food",
        "__v": 0
    },
    {
        "_id": "62a55ae273a882fe14fece3d",
        "productName": "teh manis",
        "price": 3000,
        "category": "drink",
        "__v": 0
    }
]
```

**RESPON GAGAL**
```json
{
    "auth": false,
    "accessToken": "expired"
}
```
