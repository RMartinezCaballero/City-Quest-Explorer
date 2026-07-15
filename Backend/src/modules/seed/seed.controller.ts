import { Controller, Get, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { Content } from '../../entities/content.entity';

@Controller('seed')
export class SeedController {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  @Get()
  async seed() {
    const catRepo = this.ds.getRepository(Category);
    const contentRepo = this.ds.getRepository(Content);

    if (await catRepo.count()) {
      return { ok: true, skipped: true };
    }

    const category = catRepo.create({ name: 'General', description: 'Categoría general de homenajes' });
    await catRepo.save(category);

    const content = contentRepo.create({
      title: 'Bienvenida',
      body: 'Bienvenido al libro digital de homenaje.',
      description: 'Página de bienvenida',
      categoryId: category.id,
      category,
    });
    await contentRepo.save(content);

    return { ok: true, skipped: false };
  }
}
