import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class Post {
    @PrimaryGeneratedColumn()
    id: number;


    // Description
    @Column('varchar', { length: 60 })
    title: string;

    @Column('varchar', { length: 250 })
    description: string;


    // Main content (snippet)
    @Column('varchar', { length: 20 })
    language: string;

    @Column('text')
    @ApiProperty({ maxLength: 2000 })
    content: string;


    // Authoring
    @CreateDateColumn()
    created_at: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn()
    author: User;

    
    // State
    @Exclude()
    @Column('integer', { default: 0 })
    deleted: boolean;
}
