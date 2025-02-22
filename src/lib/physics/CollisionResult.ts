export interface CollisionResult {
    a: any;
    b: any;

    /** The collision normal from A to B (unit vector). */
    normal: { x: number; y: number };

    /** How far the objects penetrate along the normal. */
    penetration: number;

    /** One or more contact points in world coordinates. */
    contactPoints: Array<{ x: number; y: number }>;

    /** Coefficient of restitution (bounciness) if you do impulse resolution. */
    restitution?: number;

    /** Friction coefficient if you apply friction. */
    friction?: number;
}
