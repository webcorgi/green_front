const express = require('express');
const router = express.Router();
const {Sequelize, DataTypes} = require('sequelize');
const ExcelJS = require('exceljs');
const path = require('path');

/* https://sequelize.org/ */

/* DB 연결 */
const sequelize = new Sequelize('book', 'dh', 'qAZ7221200!', {
    host: 'onedev.i234.me',
    dialect: 'mariadb'
});

const Book = sequelize.define('Books', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    os: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    registration_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_DATE')
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('MySQL connected');
    })
    .catch((err) => {
        console.log(err);
    });

router.use(express.json());
router.use(express.urlencoded());

// 유저가 입력한 사전예약 데이터 DB에 넣기
router.post('/', (req, res) => {
    const {os, phone, date} = req.body;
    Book
        .create({os, phone_number: phone, registration_date: date})
        .then(() => {
            console.log('Book created successfully');
            res
                .status(200)
                .send('book created successfully');
        })
        .catch((err) => {
            console.log(err);
            if (err.name === 'SequelizeUniqueConstraintError') {
                res
                    .status(502)
                    .send('ER_DUP_ENTRY');
            } else {
                res
                    .status(500)
                    .send('Error creating book');
            }
        });
});

// DB 정보 가져오기
router.get('/', (req, res) => {
    Book
        .findAll()
        .then((books) => {
            console.log('Retrieved all books successfully');
            res
                .status(200)
                .send(books);
        })
        .catch((err) => {
            console.log(err);
            res
                .status(500)
                .send('Error retrieving books');
        });
});

/* 엑셀파일로 출력 */
router.get('/export', async (req, res) => {
    try {
        // Fetch all books from the database
        const books = await Book.findAll();

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Books');

        // Add header row
        worksheet.addRow(['ID', 'OS', 'Phone Number', 'Registration Date']);

        // Add data rows
        books.forEach(book => {
            const date = new Date(book.registration_date)
                .toISOString()
                .substring(0, 10);
            worksheet.addRow([book.id, book.os, book.phone_number, date]);
        });

        // Set file path and name
        const filePath = path.join(__dirname, '/excel', 'books.xlsx');

        // Write workbook to file stream
        await workbook.xlsx.writeFile(filePath);

        console.log('Exported all books successfully');
        res.status(200).send('Exported all books successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error exporting books');
    }
});

module.exports = router;