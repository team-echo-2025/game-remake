import Scene from "../Scene";
import PhysicsObject from "./PhysicsObject";

export default class CarPhysicsObject extends PhysicsObject {
    // CAREFUL THIS IS IN RADIANS
    heading: number = 0;
    gas: number = 0;
    brake: number = 0;
    steer: number = 0;
    handbreak: number = 0;

    private mass = 10;
    private enginePower = 5000;
    private brakePower = 4000;
    private sideFrictionConstant = 100;
    private rollingFrictionConstant = 10;
    private maxSteerAngle = 2.5;

    update(dt: number, scene: Scene) {
        dt = dt / 1000;
        this.heading += this.steer * this.maxSteerAngle * dt;

        let fx = Math.cos(this.heading);
        let fy = Math.sin(this.heading);
        let sx = -fy;
        let sy = fx;

        let forwardVel = this.body.velocity.x * fx + this.body.velocity.y * fy;
        let sideVel = this.body.velocity.x * sx + this.body.velocity.y * sy;

        let driveForce = this.enginePower * this.gas - this.brakePower * this.brake;
        let driveX = driveForce * fx;
        let driveY = driveForce * fy;

        let rollingForce = -forwardVel * this.rollingFrictionConstant;
        let rollX = rollingForce * fx;
        let rollY = rollingForce * fy;

        let effectiveSideFriction = this.sideFrictionConstant;
        if (this.handbreak > 0) {
            effectiveSideFriction = 15;
        }

        let sideF = -sideVel * effectiveSideFriction;
        let sideX = sideF * sx;
        let sideY = sideF * sy;

        let Fx = driveX + rollX + sideX;
        let Fy = driveY + rollY + sideY;

        let ax = Fx / this.mass;
        let ay = Fy / this.mass;

        this.body.velocity.x += ax * dt;
        this.body.velocity.y += ay * dt;

        this.body.x += this.body.velocity.x * dt;
        this.body.y += this.body.velocity.y * dt;
    }
}
