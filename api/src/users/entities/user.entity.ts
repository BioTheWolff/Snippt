import { ApiHideProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @Exclude()
    @PrimaryGeneratedColumn()
    @ApiHideProperty()
    id: number;


    @Column({ type: "varchar", length: 30, unique: true })
    handle: string;

    @Column({ type: "varchar", length: 40 })
    display_name: string;


    @Exclude()
    @ApiHideProperty()
    @Column({ type: "varchar", length: 80, unique: true })
    email: string;

    @Exclude()
    @ApiHideProperty()
    @Column({ type: "varchar", length: 255 })
    password: string;


    @Exclude()
    @ApiHideProperty()
    @Column({ type: "bool", default: false })
    disabled: boolean;


    @Exclude()
    @ApiHideProperty()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @ApiHideProperty()
    @UpdateDateColumn()
    updated_at: Date;
}