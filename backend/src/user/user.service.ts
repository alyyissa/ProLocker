import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository,Between, MoreThanOrEqual } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ){}

  public async findAll(
    options: { page?: number; limit?: number } = {}
  ) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    const total = await this.userRepository.count();
    const totalPages = Math.ceil(total / limit);

    const currentPage = page > totalPages ? totalPages : page;

    const data = await this.userRepository.find({
      skip: (currentPage - 1) * limit,
      take: limit,
      order: { CreatedAt: 'DESC' }
    });

    return {
      data,
      total,
      page: currentPage,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  public async remove(id: number) {
    let user = await this.userRepository.findOneBy({id});
    if(!user) throw new NotFoundException('Userr not Found')

    await this.userRepository.delete(id);

    return {deleted: true}
  }

    async getUserGrowthStats() {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 5);

  // Get all users created in the last 6 months
  const users = await this.userRepository.find({
    where: {
      CreatedAt: MoreThanOrEqual(sixMonthsAgo)
    },
    select: ['CreatedAt']
  });

  // Group by month manually
  const monthCounts = new Map<string, number>();
  
  // Initialize last 6 months with 0
  const months: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    monthCounts.set(monthName, 0);
    months.push({ month: monthName, count: 0 });
  }

  // Count users per month
  users.forEach(user => {
    const monthName = user.CreatedAt.toLocaleString('default', { month: 'short', year: '2-digit' });
    const currentCount = monthCounts.get(monthName) || 0;
    monthCounts.set(monthName, currentCount + 1);
  });

  // Update months array with actual counts
  months.forEach(month => {
    month.count = monthCounts.get(month.month) || 0;
  });

  // Get total stats
  const totalUsers = await this.userRepository.count();
  const newUsersThisMonth = await this.userRepository.count({
    where: {
      CreatedAt: Between(
        new Date(today.getFullYear(), today.getMonth(), 1),
        today
      )
    }
  });

  return {
    monthlyData: months,
    stats: {
      totalUsers,
      newUsersThisMonth
    }
  };
}
}
