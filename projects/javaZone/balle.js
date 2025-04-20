class Balle {
    constructor(posX, posY, vitesseX, vitesseY, tailleX, tailleY, couleur) {
      this.posX = posX;
      this.posY = posY;
      this.vitesseX = vitesseX;
      this.vitesseY = vitesseY;
      this.tailleX = tailleX;
      this.tailleY = tailleY;
      this.couleur = couleur;
      this.multCooldown = 0.1;
      this.grabTime = 0.1;
      this.mass = tailleX * 2;
      this._isSelected = false;
  
      // Static properties
      Balle.grow = false;
      Balle.shrink = false;
      Balle.gravity = false;
      Balle.friction = false;
      Balle.teleUp = false;
      Balle.teleDown = false;
      Balle.teleRight = false;
      Balle.teleLeft = false;
      Balle.accelarate = false;
      Balle.multiply = false;
    }

    setGrabSpeedX(speed) {
      this.grabSpeedX = speed;
    }

    getGrabSpeedX() {
      return this.grabSpeedX;
    }

    setGrabSpeedY(speed) {
      this.grabSpeedY = speed;
    }

    getGrabSpeedY() {
      return this.grabSpeedY;
    }

    setIsSelected(bool) {
      this._isSelected = bool;
    }

    isSelected() {
      return this._isSelected;
    }

    setSpeedX(num) {
      this.vitesseX = num;
    }

    setSpeedY(num) {
      this.vitesseY = num;
    }

    getSpeedX() {
      return this.vitesseX;
    }

    getSpeedY() {
      return this.vitesseY;
    }

    getTailleX() {
      return this.tailleX;
    }

    getTailleY() {
      return this.tailleY;
    }

    static setTeleUp(bool) {
      Balle.teleUp = bool;
    }

    static getTeleUp() {
      return Balle.teleUp;
    }

    static setMultiply(bool) {
      Balle.multiply = bool;
    }

    static getMultiply() {
      return Balle.multiply;
    }

    static getAccelerate() {
      return Balle.accelarate;
    }

    static setAccelerate(bool) {
      Balle.accelarate = bool;
    }

    static setTeleDown(bool) {
      Balle.teleDown = bool;
    }

    static getTeleDown() {
      return Balle.teleDown;
    }

    static setTeleRight(bool) {
      Balle.teleRight = bool;
    }

    static getTeleRight() {
      return Balle.teleRight;
    }

    static setTeleLeft(bool) {
      Balle.teleLeft = bool;
    }

    static getTeleLeft() {
      return Balle.teleLeft;
    }

    getPosX() {
      return this.posX;
    }

    setPosX(posX) {
      this.posX = posX;
    }

    getPosY() {
      return this.posY;
    }

    setPosY(posY) {
      this.posY = posY;
    }

    static setGrow(bool) {
      Balle.grow = bool;
      Balle.shrink = false;
    }

    static setShrink(bool) {
      Balle.shrink = bool;
      Balle.grow = false;
    }

    static getGrow() {
      return Balle.grow;
    }

    static getShrink() {
      return Balle.shrink;
    }

    static setGravity(bool) {
      Balle.gravity = bool;
    }

    static setFriction(bool) {
      Balle.friction = bool;
    }

    static getGravity() {
      return Balle.gravity;
    }

    static getFriction() {
      return Balle.friction;
    }

    setTaille(num) {
      this.tailleY = num;
      this.tailleX = num;
    }

    mettreAJour(context, diff) {
      const NANOSECONDE = 1e-9;
      const LARGEUR = Main.LARGEUR;
      const HAUTEUR = Main.HAUTEUR;

      if (this.multCooldown > 0) {
        this.multCooldown -= diff * NANOSECONDE;
        if (this.multCooldown < 0) {
          this.multCooldown = 0;
        }
      }

      if (this.grabTime > 0) {
        this.grabTime -= diff * NANOSECONDE;
        if (this.grabTime < 0) {
          this.grabTime = 0.2;
          for (let balle of Main.ballesList) {
            if (balle._isSelected) {
              Main.setMousex(balle.posX);
              Main.setMousey(balle.posY);
            }
          }
        }
      }

      this.posX += diff * NANOSECONDE * this.vitesseX;
      this.posY += diff * NANOSECONDE * this.vitesseY;

      if (!this._isSelected) {
        if (this.vitesseX > 0 && this.posX >= LARGEUR - this.tailleX / 2 && !Balle.teleLeft) {
          this.vitesseX *= -1;
          if (Balle.friction) {
            this.vitesseX *= 0.9;
          }
          if (this.tailleX < 100 && Balle.grow) {
            this.tailleX += 1;
            this.tailleY += 1;
          }
          if (this.tailleX > 1 && Balle.shrink) {
            this.tailleX -= 1;
            this.tailleY -= 1;
          }
          if (Balle.accelarate) {
            this.vitesseX *= 1.001;
          }
        } else if (Balle.teleLeft && this.posX >= LARGEUR - this.tailleX / 2) {
          this.posX = 0 - this.tailleX / 2;
        }

        if (this.vitesseY > 0 && this.posY >= HAUTEUR - this.tailleY / 2 && !Balle.teleUp) {
          this.vitesseY *= -1;
          if (Balle.friction) {
            this.vitesseX *= 0.9;
          }
          if (Balle.gravity && Balle.friction) {
            this.vitesseY *= 0.2;
          } else if (Balle.gravity) {
            this.vitesseY *= 0.7;
          }
          if (this.tailleX < 100 && Balle.grow) {
            this.tailleX += 1;
            this.tailleY += 1;
          }
          if (this.tailleX > 1 && Balle.shrink) {
            this.tailleX -= 1;
            this.tailleY -= 1;
          }
          if (Balle.accelarate) {
            this.vitesseY *= 1.4;
          }
        } else if (Balle.teleUp && this.posY + this.tailleY / 2 >= HAUTEUR) {
          this.posY = 0 - this.tailleY / 2;
        }

        if (this.posX >= LARGEUR - this.tailleX / 2) {
          this.posX = LARGEUR - this.tailleX / 2;
        }
        if (this.posY >= HAUTEUR - this.tailleY / 2) {
          this.posY = HAUTEUR - this.tailleY / 2;
        }

        if (Balle.gravity) {
          this.vitesseY += 9;
        }
      }

      if (this.posX < 0 + this.tailleX / 2) {
        this.posX = 0 + this.tailleX / 2;
      }
      if (this.posY < 0 + this.tailleY / 2) {
        this.posY = 0 + this.tailleY / 2;
      }

      context.fillStyle = this.couleur;
      context.beginPath();
      context.arc(this.posX, this.posY, this.tailleX / 2, 0, Math.PI * 2);
      context.fill();
    }

    enCollisionAvec(autre) {
      const dx = autre.posX - this.posX;
      const dy = this.posY - autre.posY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const distMinimaleEntreLesBalles = (this.tailleX / 2) + (autre.tailleX / 2);
      return distMinimaleEntreLesBalles - dist >= 0;
    }

    enCollisionAvecBonus(autre) {
      if (this.enCollisionAvec(autre)) {
        if (Balle.multiply && this.multCooldown === 0 && Main.maxBalls > Main.ballesList.length) {
          const r = new Random();
          this.setTaille(this.tailleX / 2);
          Main.ballesList.push(new Balle(
            this.posX,
            this.posY,
            r.nextDouble(0, 1000),
            r.nextDouble(0, 1000),
            this.tailleX <= 1 ? 1 : this.tailleX,
            this.tailleY <= 1 ? 1 : this.tailleY,
            `rgb(${r.nextFloat()}, ${r.nextFloat()}, ${r.nextFloat()})`
          ));
          this.multCooldown = 1;
          autre.multCooldown = 1;
        }

        if (Balle.friction) {
          this.vitesseX *= 0.95;
          this.vitesseY *= 0.95;
          autre.vitesseX *= 0.95;
          autre.vitesseY *= 0.95;
          if (Balle.gravity) {
            if (this.vitesseY > 0.1) this.vitesseY -= 8;
            else this.vitesseY = 0;
            if (autre.vitesseY > 0.1) autre.vitesseY -= 8;
            else autre.vitesseY = 0;
          }
        }

        const dx = autre.posX - this.posX;
        const dy = autre.posY - this.posY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const distMinimaleEntreLesBalles = (this.tailleX / 2) + (autre.tailleY / 2);
        const directionX = dx / dist;
        const directionY = dy / dist;
        const chevauchement = dist - distMinimaleEntreLesBalles;
        const deplacementX = directionX * chevauchement;
        const deplacementY = directionY * chevauchement;

        this.mass = Math.PI * Math.pow(this.tailleX / 2, 2);
        autre.mass = Math.PI * Math.pow(autre.tailleX / 2, 2);
        const things = Vector.getAfterCollisionVitesses(this, autre);

        this.vitesseX = things[0];
        this.vitesseY = things[1];
        autre.vitesseX = things[2];
        autre.vitesseY = things[3];

        this.posX -= deplacementX;
        this.posY -= deplacementY;
      }
    }
  }
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
