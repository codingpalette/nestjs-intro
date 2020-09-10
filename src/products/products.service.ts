import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from "./product.model";

@Injectable()
export class ProductsService {


    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    async insertProduct(title: string, desc: string, price: number) {
        const newProduct = new this.productModel({
            title:title,
            description: desc,
            price: price
        });
        const result = await newProduct.save();
        return result.id as string;
    }

    async getProducts() {
        const products = await this.productModel.find().exec();
        return products.map((prod) => ({
            id: prod.id,
            title: prod.title,
            description: prod.description,
            price: prod.price
        }));
    }

    async getSingleProduct(productId: string) {
        const product = await this.findProduct(productId);
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price
        };
    }

    async updateProduct(productId: string, title: string, desc: string, price: number) {
        const updateProduct = await this.findProduct(productId);
        if (title) {
            updateProduct.title = title;
        }
        if (desc) {
            updateProduct.description = desc;
        }
        if (price) {
            updateProduct.price = price;
        }
        updateProduct.save()
    }

    async deleteProduct(prodId: string) {
       const result = await this.productModel.deleteOne({_id: prodId}).exec();
       if (result.n === 0) {
           throw new NotFoundException('삭제할 상품이 없습니다.')
       }
    }

    private async findProduct(id: string): Promise<Product> {
        let product
        try {
            product = await this.productModel.findById(id).exec();
        } catch (e) {
            throw new NotFoundException('존재하지 않는 상품입니다.')
        }

        if (!product) {
            throw new NotFoundException('존재하지 않는 상품입니다.')
        }
        return product;
    }


}
