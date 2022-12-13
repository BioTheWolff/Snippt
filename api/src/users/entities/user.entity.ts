import { ApiHideProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { Post } from "src/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @Exclude()
    @PrimaryGeneratedColumn()
    @ApiHideProperty()
    id: number;


    // Public Profile
    @Column({ type: "varchar", length: 30, unique: true })
    handle: string;

    @Column({ type: "varchar", length: 40 })
    display_name: string;

    @ManyToMany(() => User, (user) => user.followers)
    @JoinTable()
    following!: User[];

    @ManyToMany(() => User, (user) => user.following)
    followers!: User[];

    @OneToMany(() => Post, post => post.id)
    posts: Post[];


    // Private profile
    @Exclude()
    @ApiHideProperty()
    @Column({ type: "varchar", length: 80, unique: true })
    email: string;

    @Exclude()
    @ApiHideProperty()
    @Column({ type: "varchar", length: 255 })
    password: string;


    // Internal use
    @Exclude()
    @ApiHideProperty()
    @Column({ type: "integer", default: 0 })
    disabled: boolean;

    @Exclude()
    @ApiHideProperty()
    @Column({ type: "integer", default: 0 })
    admin: boolean;


    // Logs
    @Exclude()
    @ApiHideProperty()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @ApiHideProperty()
    @UpdateDateColumn()
    updated_at: Date;


    // Other properties
    @Exclude()
    @ApiHideProperty()
    jwtExpirationDate: number = null;


    // Methods
    is_disabled() {
        return Boolean(this.disabled);
    }

    is_admin() {
        return Boolean(this.admin);
    }

    follow(target: User) {
        if (this.following) {
            this.following.push(target);
        }
        else {
            this.following = [target];
        }

        if (target.followers) {
            target.followers.push(this);
        } else {
            target.followers = [this];
        }
    }

    unfollow(target: User) {
        if (!this.following) return;

        this.following = this.following.filter((u) => u.id != target.id);

        if (!target.followers) return;
        target.followers = target.followers.filter((u) => u.id != this.id);
    }
}