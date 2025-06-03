import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Length(2, 50, { message: 'O nome deve ter entre 2 e 50 caracteres' })
  name: string;

  @IsEmail({}, { message: 'O e-mail do remetente é inválido' })
  from: string;

  @IsEmail({}, { message: 'O e-mail do destinatário é inválido' })
  to: string;

  @IsNotEmpty({ message: 'O assunto é obrigatório' })
  @Length(3, 100, { message: 'O assunto deve ter entre 3 e 100 caracteres' })
  subject: string;

  @IsNotEmpty({ message: 'A mensagem não pode estar vazia' })
  message: string;
}
