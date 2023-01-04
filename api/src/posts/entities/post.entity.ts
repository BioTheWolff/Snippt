import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
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


    // Answers chain
    @ManyToOne(() => Post, post => post.answers, { onDelete: 'CASCADE', nullable: true })
    @Transform(({ value }) => value ? value.id : null)
    parent: Post;

    @OneToMany(() => Post, post => post.parent, { onDelete: 'CASCADE' })
    @JoinColumn()
    answers: Post[];

    
    // State
    @Exclude()
    @Column('boolean', { default: false })
    deleted: boolean;

    getPublicVersion() {
        let post = {
            id: this.id,
            title: this.title,
            parent: this.parent,
            answers: this.answers 
                ? this.answers.map(p => p.getPublicVersion())
                : undefined,
            author: this.author,
            total_likes: this.total_likes,
            total_dislikes: this.total_dislikes,
        }

        if (this.deleted) {
            post['deleted'] = true;
        } else {
            post['description'] = this.description;
            post['content'] = this.content;
            post['language'] = this.language;
        }

        return post;
    }
}
