## tools yang digunakan
````
bahasa pemrograman:  Nodejs
Database          :  Postgresql
messege queue     :  Kafka
IDE               :  Vscode
````

## instalasi
````
1. instal nodejs, postgresql dan kafka
2. run pada command prompt "npm install" untuk mendownload library yang digunakan pada service
3. run service "node index.js"
````

## list service

ini adalah list service yang digunakan dan harus dijalankan bersamaan agar service-service yang ada berjalan dengan baik
````
1. Gateway service (localhost:5000) bertujuan untuk mengakses atau memelihara koneksi berkelanjutan untuk menangani transfer pesan antara layanan backend dan klien. jadi klien hanya cukup melakukan request ke gateway dan kemudian akan diarahkan ke service yang dituju
2. User service (localhost:3001) bertujuan untuk membuat user, login, edit user(admin), maupun delete user(admin)
3. Modul service (localhost:3011) bertujuan untuk membuat kumpulan beberapa soal dalam satu modul ujian atau satu paket ujian
4. Soal service (localhost:3012) bertujuan untuk membuat soal ujian, sebelum dikelompokkan kedalam modul service
5. Task service (localhost:3099) bertujuan untuk penghubung data antar service, jadi data yang telah dibuat atau diedit akan masuk kedalam task
````
