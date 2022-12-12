import { ApiHideProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @OneToMany(() => User, (user) => user.followers)
    @Transform(({ value }: { value: User }) => { handle: value.handle})
    following: User[];

    @OneToMany(() => User, (user) => user.following)
    @Transform(({ value }: { value: User }) => { handle: value.handle})
    followers: User[];


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
}