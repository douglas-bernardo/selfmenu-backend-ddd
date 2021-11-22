import {
    ObjectID,
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ObjectIdColumn,
    BeforeInsert,
} from 'typeorm';

@Entity('notifications')
class Notification {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    content: string;

    @Column('uuid')
    recipient_id: string;

    @Column('uuid')
    establishment_id: string;

    @Column({ default: false })
    read: boolean;

    @BeforeInsert()
    beforeInsertActions() {
        this.read = false;
    }

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Notification;
