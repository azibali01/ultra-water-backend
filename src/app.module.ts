/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './features/products/products.module';
import { UserModule } from './features/user/user.module';
import { AuthModule } from './features/auth/auth.module';
import { PurchaseModule } from './features/purchase/purchase.module';
import { SalesModule } from './features/sales/sales.module';
import { ExpenseModule } from './features/expenses/expense.module';
import { AccountsModule } from './features/Accounts/accounts.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ProductsModule,
    PurchaseModule,
    SalesModule,
    ExpenseModule,
    AccountsModule,
    MongooseModule.forRoot('mongodb+srv://isalman23701_db_user:HXsKVncBZroVVPaO@cluster0.qxavhuz.mongodb.net/'),],

  providers: [],
  controllers: [],
})
export class AppModule { }



// mongodb+srv://isalman23701_db_user:<db_password>@cluster0.qxavhuz.mongodb.net/?appName=Cluster0