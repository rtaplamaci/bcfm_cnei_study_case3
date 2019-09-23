## Cloud Native Engineer Intern Case Study
Tüm bu işlemler Ubuntu 18.04.3 LTS işletim sisteminde gerçekleştirilmiştir.

NodeJs+MongoDB Projesi Deploy Etme Görevi

* Bu görev için öncelikli olarak Dosya sisteminde bir klasör oluşturdum. Ardından ilgili proje dosyalarını ilgili dizine taşıdım. Bu noktada index.js dosyasını hazırlarken MongoDb'ye bağlanmak için bağlantı cümlesinde(urlinde) Ip adresi yerine daha sonra Composer ile projemize ilişkilendireceğimiz mongo containerinin adını verdim.

* Ardından terminal ekranından Nano editörü ile Dockerfile dosyasını oluşturdum ve içeriğini aşağıdaki gibi düzenledim.

```bash
#Projenin kullanacağı pakte
FROM node:latest

MAINTAINER Ramazan Taplamacı <ramazantaplamai81@gmail.com>

#Projenin kaynak dosyaları için dizin oluşturulması.
WORKDIR /usr/src/node-note-app

#Gerekli package.json dosyasının kopyalanması.
COPY package.json ./

#package.json daki gerekli kütüphanelerin yüklenmesi için gerekli.
#Express, socker-io, vs.
RUN npm install --only=production

#"." bütün kaynak kodları -> "." workdir de belirttiğim klasöre kopyala.
COPY . .

#kullanılacak port.
EXPOSE 3000

#docker run komutunu çalıştırırken çalışıcak komut.
ENTRYPOINT [ "node" ]

#docker run komutunu çalıştırırken ENTRYPOINT komutunun yanına eklenicek ekstra parametre
#docker run komutunu çalıştırırken değiştirebiliriz.
CMD [ "index.js" ]

```

* Ardından istemediğim dosyaların Docker İmajına kopyalanmaması için terminal üzerinde nano editörü ile .dockerignore dosyasını oluşturdum ve içeriğini aşağıdaki gibi düzenledim.
```bash
Dockerfile
node_modules
npm-debug.log
 ```
 
* Ardından terminal üzerinde nano editörü ile docker-compose.yml dosyasını oluşturdum ve içeriğini aşağıdaki gibi düzenledim.
```bash
version: "2"
services:
#rtaplamaci-node-note-app adında servis tanımlıyoruz
  rtaplamaci-node-note-app:
    container_name: ramazan-taplamaci-node-note-app
# servis durduğundan tekrar başlatılacak
    restart: always
# aynı dizinde bulunan Dockerfile ile image oluşturulacak
    build: .
# 3000 portunu 3000 portuna yönlendiriliyoruz
    ports:
      - "3000:3000"
# mongo servisi ile ilişkilendiriliyoruz
    links:
      - mongo
  mongo:
    container_name: mongo
# DockerHubda bulunan latest mongo imajı kullanılacak
    image: mongo
    ports:
      - "27017:27017"
 ```
 * Ardından aşağıdaki komut ile docker-compose.yml dosyamı çalıştırdım ve her iki containerımda çalışmaya başladı.
 ```bash
docker -compose up
 ```
 
