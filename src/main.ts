import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from "cookie-parser";

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      exposeUnsetFields: false
    }
  }))

  //app.setBaseViewsDir(join(__dirname, '..', '..', 'views'));
  app.setBaseViewsDir('views');
  app.setViewEngine('ejs');
  //app.useStaticAssets(join(__dirname, '..', '..', 'public'));
  app.useStaticAssets('public');

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
