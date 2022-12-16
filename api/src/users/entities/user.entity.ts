import { ApiHideProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Post } from "../../posts/entities/post.entity";
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

    @ManyToMany(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
    @JoinTable()
    following!: User[];

    @ManyToMany(() => User, (user) => user.following, { onDelete: 'CASCADE' })
    followers!: User[];


    // Posts
    @OneToMany(() => Post, post => post.id, { onDelete: 'CASCADE' })
    posts: Post[];

    @ManyToMany(() => Post, post => post.likes, { onDelete: 'CASCADE' })
    @JoinTable({
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "post_id",
            referencedColumnName: "id"
        }
    })
    likes: Post[];

    @ManyToMany(() => Post, post => post.dislikes, { onDelete: 'CASCADE' })
    @JoinTable({
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "post_id",
            referencedColumnName: "id"
        }
    })
    dislikes: Post[];


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
    @Column({ type: "boolean", default: false })
    disabled: boolean;

    @Exclude()
    @ApiHideProperty()
    @Column({ type: "boolean", default: false })
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

    likePost(target: Post) {
        // make sure we are back to neutral before liking
        this.backToNeutralForPost(target);

        if (this.likes) {
            this.likes.push(target);
        } else {
            this.likes = [target];
        }

        if (target.likes) {
            target.likes.push(this);
        } else {
            target.likes = [this];
        }
    }

    dislikePost(target: Post) {
        // make sure we are back to neutral before disliking
        this.backToNeutralForPost(target);

        if (this.dislikes) {
            this.dislikes.push(target);
        } else {
            this.dislikes = [target];
        }

        if (target.dislikes) {
            target.dislikes.push(this);
        } else {
            target.dislikes = [this];
        }
    }

    // remove like or dislike reaction
    backToNeutralForPost(target: Post) {
        if (this.likes) {
            // if it was a like
            this.likes = this.likes.filter(p => p.id != target.id);
            target.likes = target.likes.filter(u => u.id != this.id);
        }
        if (this.dislikes) {
            // if it was a dislike
            this.dislikes = this.dislikes.filter(p => p.id != target.id);
            target.dislikes = target.dislikes.filter(u => u.id != this.id);
        }
    }
}