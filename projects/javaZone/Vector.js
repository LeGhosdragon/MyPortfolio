class Vector {
    constructor(vitesseX = 0, vitesseY = 0) {
        this.vitesseX = vitesseX;
        this.vitesseY = vitesseY;
        this.module = this.getModule();
        this.angle = Math.atan2(this.vitesseY, this.vitesseX); // in radians
    }

    getVector() {
        return [this.vitesseX, this.vitesseY];
    }

    getModule() {
        return Math.sqrt(this.vitesseX ** 2 + this.vitesseY ** 2);
    }

    getAngle() {
        return this.angle;
    }

    static getAfterCollisionVitesses(b1, b2) {
        const mod1 = new Vector(b1.speedX, b1.speedY);
        const mod2 = new Vector(b2.speedX, b2.speedY);

        let v1 = mod1.getModule();
        let v2 = mod2.getModule();

        if (b1.isSelected) {
            v1 = Vector.faireModule(b1.getGrabSpeedX(), b1.getGrabSpeedY());
        }

        if (b2.isSelected) {
            v2 = Vector.faireModule(b2.getGrabSpeedX(), b2.getGrabSpeedY());
        }

        const m1 = b1.mass;
        const m2 = b2.mass;
        const angle1 = mod1.getAngle();
        const angle2 = mod2.getAngle();
        const phi = Vector.getPhi(b1, b2);

        const V1 = Vector.getVitessesRez(v1, v2, m1, m2, angle1, angle2, phi);
        let [V1x, V1y] = V1;

        const V2 = Vector.getVitessesRez(v2, v1, m2, m1, angle2, angle1, Math.abs(phi));
        let [V2x, V2y] = V2;

        if (b1.isSelected) { V1x = 0; V1y = 0; }
        if (b2.isSelected) { V2x = 0; V2y = 0; }

        return [V1x, V1y, V2x, V2y];
    }

    static getVitessesRez(v1, v2, m1, m2, angle1, angle2, phi) {
        const coef = ((v1 * Math.cos(angle1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(angle2 - phi)) / (m1 + m2));
        const vx = (coef * Math.cos(phi)) + (v1 * Math.sin(angle1 - phi) * Math.cos(phi + Math.PI / 2));
        const vy = (coef * Math.sin(phi)) + (v1 * Math.sin(angle1 - phi) * Math.sin(phi + Math.PI / 2));
        return [vx, vy];
    }

    static getPhi(b1, b2) {
        return Math.atan2(b2.posY - b1.posY, b2.posX - b1.posX);
    }

    static faireModule(x, y) {
        return Math.sqrt(x ** 2 + y ** 2);
    }
}
