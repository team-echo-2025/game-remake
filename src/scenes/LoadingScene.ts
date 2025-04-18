import Scene from "../lib/Scene";
import ButtonTest from "../lib/ui/ButtonTest";

export default class LoadingScene extends Scene {
    loading_button!: ButtonTest;
    loading_progress: number = 0;
    falling_debris: { x: number; y: number; size: number; speed: number }[] = [];
    angle: number = 0;
    particles: { x: number; y: number; size: number; speedX: number; speedY: number }[] = [];
    loading_hint: string = "";

    constructor() {
        super("loading-scene");
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
    }

    setup(): void {
        this.loading_button = this.add_new.button({
            label: "",  // no label to prevent getting an empty white text 
            font_key: "jersey",
        });

        this.loading_button.setup();

        //  this hides the loading button completely because it was causing issues with leaving a white label text box
        this.loading_button.x = -9999;
        this.loading_button.y = -9999;

        for (let i = 0; i < 10; i++) {
            this.falling_debris.push({
                x: this.p5.random(0, this.p5.width),
                y: this.p5.random(-100, -10),
                size: this.p5.random(5, 15),
                speed: this.p5.random(2, 5),
            });
        }

        // Randomize the hint each time the scene starts
        const hints = [
            "Tip: Solve the puzzle carefully, or you’ll lose valuable time!",
            "Hint: Explore it all, you might rock the boat, but it’ll float your boat!",
            "Fun Fact: James actually broke everything",
            "Remember: Time only moves forward… or does it?",
            "Dev Tip: Take a break, touch some grass 🌱",
            "Tip: Watch out for Greg, he might sneak up and touch ya!",
            "Historical quote: 'Delta beatz, more like Delta Airlines'-Layth ",
            "Historical quote 'I'm whipping it out'- Eli"
        ];

        this.loading_hint = this.p5.random(hints);

        this.p5.rectMode(this.p5.CENTER);
    }

    draw(): void {
        const p = this.p5;

        // Background
        p.fill("#2d2d3e");
        p.noStroke();
        p.rect(0, 0, p.width, p.height);

        this.drawFallingDebris();
        this.applyScreenDistortion();
        this.updateLoadingBar();
        this.drawLoadingLabel(); // just exists (deal with it)
        this.drawLoadingTitle(); // centered title (EXIT PARADOX) above loading bar
        this.drawLoadingBar();
        this.drawParticles(); 
        this.drawLoadingHint(); // Draw the random hint under the loading bar
    }

    drawLoadingTitle(): void {
        const p = this.p5;
        const title = "EXIT PARADOX";
        const fontSize = 40;

        p.push();
        p.rectMode(p.CENTER);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(fontSize);
        p.fill(255); // White text

        const barHeight = 30;
        const barY = 50;
        const titleY = barY - (barHeight / 2) - fontSize;

        p.text(title, 0, titleY);
        p.pop();
    }

    drawFallingDebris(): void {
        const p = this.p5;
        p.push();
        for (let debris of this.falling_debris) {
            p.fill(150, 150, 150, 180);
            p.noStroke();
            p.ellipse(debris.x, debris.y, debris.size);
            debris.y += debris.speed;
            if (debris.y > p.height) {
                debris.y = this.p5.random(-100, -10);
                debris.x = this.p5.random(0, p.width);
            }
        }
        p.pop();
    }

    applyScreenDistortion(): void {
        const p = this.p5;
        const distortionStrength = 2;
        p.push();
        p.translate(p.width / 2, p.height / 2);
        p.rotate(this.p5.sin(this.angle) * distortionStrength);
        this.angle += 0.05;
        p.translate(-p.width / 2, -p.height / 2);
        p.pop();
    }

    updateLoadingBar(): void {
        this.loading_progress += 0.5;
        if (this.loading_progress > 100) {
            this.loading_progress = 100;
        }
    }

    drawLoadingLabel(): void {
        // Nothing here (label removed)
    }

    drawLoadingBar(): void {
        const p = this.p5;
        const barWidth = p.width * 0.5;
        const barHeight = 30;
        const x = 0;
        const y = 50;

        p.push();
        p.rectMode(p.CENTER);
        p.stroke(255, 255, 255, 100);
        p.fill(30, 30, 30);
        p.rect(x, y, barWidth + 10, barHeight + 10);
        p.pop();

        p.push();
        p.rectMode(p.CORNER);
        p.noStroke();
        p.fill("#a2b5c7");
        p.rect(
            x - barWidth / 2,
            y - barHeight / 2,
            (this.loading_progress / 100) * barWidth,
            barHeight
        );
        p.pop();
    }

    drawParticles(): void {
        const p = this.p5;

        if (this.p5.random() < 0.05) {
            this.particles.push({
                x: this.p5.random(0, p.width),
                y: this.p5.random(p.height - 100, p.height),
                size: this.p5.random(3, 6),
                speedX: this.p5.random(-1, 1),
                speedY: this.p5.random(-1, 2),
            });
        }

        p.push();
        for (let particle of this.particles) {
            p.fill(255, 100, 0, 150);
            p.noStroke();
            p.ellipse(particle.x, particle.y, particle.size);

            particle.x += particle.speedX;
            particle.y -= particle.speedY;
            particle.size *= 0.98;

            if (particle.size < 1) {
                this.particles.splice(this.particles.indexOf(particle), 1);
            }
        }
        p.pop();
    }

    // New method to draw the random hint below the loading bar
    drawLoadingHint(): void {
        const p = this.p5;
        const fontSize = 16;
        const barY = 50;
        const hintY = barY + 40;

        p.push();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(fontSize);
        p.fill(180);
        p.text(this.loading_hint, 0, hintY);
        p.pop();
    }
}
