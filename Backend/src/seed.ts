import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Content } from './entities/content.entity';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const catRepo = getRepository(Category);
  const contentRepo = getRepository(Content);

  const count = await catRepo.count();
  if (count === 0) {
    const category = catRepo.create({ name: 'General', description: 'Categoría general de homenajes' });
    await catRepo.save(category);
    
    const content = contentRepo.create({
      title: 'Bienvenida',
      body: 'Bienvenido al libro digital de homenaje.',
      description: 'Página de bienvenida',
      categoryId: category.id,
      category
    });
    await contentRepo.save(content);
    console.log('Seed OK');
  } else {
    console.log('Seed skip');
  }
  
  await app.close();
}

main().catch(console.error);
