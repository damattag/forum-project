import { ConflictException } from "@nestjs/common";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

const createAccountBodyValidationSchema = new ZodValidationPipe(createAccountBodySchema);

@Controller("accounts")
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) { }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body(createAccountBodyValidationSchema) body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await hash(password, 8);
    
    return this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
  }
}