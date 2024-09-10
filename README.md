# 家庭記帳本

簡單、輕鬆的紀錄生活中的支出。
- [線上觀看連結]()

## 專案畫面

![image](https://github.com/alan890729/expense-tracker/blob/main/public/images/screenshot-1.png)

## Features - 產品功能

1. 使用者可以註冊帳號
2. 使用者可以登入、登出已註冊的帳號
3. 使用者可以用facebook登入
4. 使用者可以瀏覽隸屬於其帳號下的全部的支出紀錄
5. 使用者可以新增支出紀錄
6. 使用者可以編輯支出紀錄
7. 使用者可以刪除支出紀錄
8. 使用者可以在瀏覽全部支出紀錄的頁面，排序支出紀錄的顯示順序
9. 在全部的支出紀錄、以分類篩選的支出紀錄兩個頁面，有分頁器讓使用者可以維持一頁最多十筆支出紀錄的觀看模式。

## Getting Started - 啟動專案

以下為**Getting Started - 啟動專案**的各段落的摘要：
1. **Prerequisites - 環境建置與需求**：使用什麼框架、模組，以及各種工具的版本。
2. **Installing - 專案安裝流程**：如何從github下載這個專案，並在自己的本地環境啟動此專案。


### Prerequisites - 環境建置與需求
- Node.js(RTE) - v20.14.0
- MySQL - v8.0.16
- [Express.js](https://expressjs.com)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Bootstrap](https://getbootstrap.com/docs/5.2/getting-started/introduction/)
- [font-awesome](https://fontawesome.com/)
- [Express-handlebars](https://www.npmjs.com/package/express-handlebars)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [sequelize](https://www.npmjs.com/package/sequelize)
- [sequelize-cli](https://www.npmjs.com/package/sequelize-cli)
- [method-override](https://www.npmjs.com/package/method-override)
- [express-session](https://www.npmjs.com/package/express-session)
- [connect-flash](https://www.npmjs.com/package/connect-flash)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [passport](https://www.npmjs.com/package/passport)
- [passport-local](https://www.npmjs.com/package/passport-local)
- [passport-facebook](https://www.npmjs.com/package/passport-facebook)

### Installing - 專案安裝流程

1. 打開terminal，輸入
    ```
    git clone https://github.com/alan890729/expense-tracker.git
    ```

2. 開啟終端機(Terminal)，進入存放此專案的資料夾
    ```
    cd expense-tracker
    ```

3. 安裝 npm 套件
    ```
    npm install
    ```

4. 在MySQL WorkBench建立一個名為expense-tracker的資料庫

    以下提供兩個方案，一是資料庫中沒有存在與expense-tracker同名的資料庫，二是資料庫已存在expense-tracker資料庫，所以建立另一個資料庫，用途是來執行此專案

    - 資料庫沒有與expense-tracker同名的資料庫

      打開MySQL WorkBench，輸入以下指令建立資料庫：
      ```
      CREATE DATABASE `expense-tracker`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
      ```

      進到./config/config.json把"development"之下的"username", "password"的值改成你自己MySQL WorkBench使用的username和password

    - 資料庫有與expense-tracker同名的資料庫，所以另外建立一個執行此專案用的資料庫

      打開MySQL WorkBench，輸入以下指令建立資料庫：
      ```
      CREATE DATABASE `test-database`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
      ```

      進到./config/config.json把"development"之下的"username", "password"的值改成你自己MySQL WorkBench使用的username和password，"database"的值則改成"test-database"

5. 執行db migrate和db seed

    資料庫建立好後，打開終端機並移動到此專案目錄之下，輸入以下指令：
    ```
    npm run migrate
    npm run seed
    ```
    上面的指令會執行migration以及植入種子資料

6. 參考.env.example的模板建立自己的.env

7. 是否已經安裝nodemon
  
    - 已有nodemon，直接根據作業系統是windows或是unix-like，去各自輸入以下指令啟動專案

        windows:
        ```
        npm run dev:windows
        ```

        unix:
        ```
        npm run dev:unix
        ```
        server會在 <http://localhost:3000> 執行

    - 還沒有安裝nodemon，先退回前一個路徑，在global安裝nodemon。輸入：
        ```
        npm install -g nodemon
        ```

        接著再回到 **expense-tracker** 資料夾內，輸入：

        windows:
        ```
        npm run dev:windows
        ```

        unix:
        ```
        npm run dev:unix
        ```

## Authors

  - [**Alpha Camp**](https://tw.alphacamp.co/) - provide project template.
  - [**Alan Huang**](https://github.com/alan890729) - build this project with express.js based on provided project template.

