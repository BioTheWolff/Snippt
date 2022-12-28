import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
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
    @Exclude()
    @CreateDateColumn()
    created_at: number;

    @Exclude()
    @UpdateDateColumn()
    updated_at: number;

    @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
    @JoinColumn()
    @Transform(({ value }) => ({ handle: value.handle, display_name: value.display_name }))
    author: User;

    
    // Likes
    @Exclude()
    @ManyToMany(() => User, user => user.likes, { onDelete: 'CASCADE' })
    @Transform(({ value }) => ({ handle: value.handle, display_name: value.display_name }))
    likes: User[];

    @Exclude()
    @ManyToMany(() => User, user => user.dislikes, { onDelete: 'CASCADE' })
    @Transform(({ value }) => ({ handle: value.handle, display_name: value.display_name }))
    dislikes: User[];

    @Column('integer', { default: 0 })
    total_likes: number;

    @Column('integer', { default: 0 })
    total_dislikes: number;

    
    // State
    @Exclude()
    @Column('boolean', { default: false })
    deleted: boolean;
}
