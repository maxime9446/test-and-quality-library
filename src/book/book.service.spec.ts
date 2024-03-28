import { BookService } from './book.service';
import { Book, Category } from './schemas/book.schema';
import mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('BookService', () => {
    let bookService: BookService;

    const createdBook = {
        _id: '61c0ccf11d7bf83d153d7c06',
        title: 'Arsène Lupin',
        description: 'Gentleman cambrioleur',
        author: 'Maurice Leblanc',
        price: 10,
        category: Category.ADVENTURE,
    };

    const mockDB = {
        create: jest.fn().mockResolvedValue(createdBook),
        findById: jest.fn().mockResolvedValue(createdBook),
        findByIdAndUpdate: jest.fn().mockResolvedValue(createdBook),
        findByIdAndDelete: jest.fn().mockResolvedValue(createdBook),
        find: jest.fn().mockResolvedValue([createdBook]),
        mockResolvedValue: jest.fn(),
    } as unknown as mongoose.Model<Book>;

    beforeEach(() => {
        bookService = new BookService(mockDB);
    });

    describe('findAll', () => {
        it('should return an array of books', async () => {
            const result = await bookService.findAll();
            expect(result).toEqual([createdBook]);
        });
    });

    describe('create', () => {
        it('should create and return a book', async () => {
            const newBook = {
                title: 'Arsène Lupin',
                description: 'Gentleman cambrioleur',
                author: 'Maurice Leblanc',
                price: 10,
                category: Category.ADVENTURE,
            };
            const result = await bookService.create(newBook as Book);
            expect(result).toEqual(createdBook);
        });

        it('should return undefined if book is not valid', async () => {
            const invalidBook = {
                author: 'Maurice Leblanc',
            };
            const result = await bookService.create(invalidBook as Book);
            expect(result).toBeUndefined();
        });
    });

    describe('findById', () => {
        it('should return a book by ID', async () => {
            const id = '61c0ccf11d7bf83d153d7c06';
            const result = await bookService.findById(id);
            expect(result).toEqual(createdBook);
        });

        it('should throw NotFoundException if book is not found', async () => {
            const id = 'nonExistingId';
            (mockDB.findById as jest.Mock).mockResolvedValue(null);
            await expect(bookService.findById(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateById', () => {
        it('should update and return a book', async () => {
            const id = '61c0ccf11d7bf83d153d7c06';
            const updatedBook = {
                _id: id,
                title: 'Updated Title',
                description: 'Updated Description',
                author: 'Updated Author',
                price: 20,
                category: Category.ADVENTURE,
            };
            const result = await bookService.updateById(id, updatedBook as Book);
            expect(result).not.toEqual(updatedBook);
        });
    });

    describe('deleteById', () => {
        it('should delete and return a book', async () => {
            const id = '61c0ccf11d7bf83d153d7c06';
            const result = await bookService.deleteById(id);
            expect(result).toEqual(createdBook);
        });
    });

    describe('isValid', () => {
        it('should return true if book is valid', () => {
            const validBook = {
                title: 'Valid Book',
                description: 'Valid Description',
                author: 'Valid Author',
                price: 10,
                category: Category.ADVENTURE,
            };
            const result = bookService.isValid(validBook as Book);
            expect(result).toBe(true);
        });

        it('should return false if book is not valid', () => {
            const invalidBook = {
                author: 'Invalid Author',
            };
            const result = bookService.isValid(invalidBook as Book);
            expect(result).toBe(false);
        });
    });
});
