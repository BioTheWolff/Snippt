import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 30, unique: true })
    handle: string;
    @Column({ type: "varchar", length: 40 })
    display_name: string;
    
    @Column({ type: "varchar", length: 80, unique: true })
    email: string;
    @Column({ type: "varchar", length: 255 })
    password: string;

    @Column({ type: "bool" })
    disabled: boolean;

    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}