/**
 * Portfolio Background Effects
 * Particle network, floating shapes, and ambient animations
 */

(function() {
    'use strict';

    // ============================================
    // Particle Network Canvas
    // ============================================
    function initParticles() {
        var canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var particles = [];
        var mouse = { x: null, y: null, radius: 150 };
        var animId = null;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        // Observe body height changes
        var resizeObserver = new ResizeObserver(function() {
            canvas.height = document.documentElement.scrollHeight;
        });
        resizeObserver.observe(document.body);

        var isDark = document.body.classList.contains('dark');

        function getColor() {
            isDark = document.body.classList.contains('dark');
            return isDark ? 'rgba(102, 126, 234, ' : 'rgba(15, 80, 100, ';
        }

        var particleCount = Math.min(80, Math.floor(window.innerWidth / 18));
        var connectionDistance = 140;

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 0.8;
            this.baseRadius = this.radius;
            this.opacity = Math.random() * 0.5 + 0.25;
        }

        Particle.prototype.update = function() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x !== null) {
                var dx = mouse.x - this.x;
                var dy = mouse.y - this.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    var force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                    this.radius = this.baseRadius + force * 2;
                } else {
                    this.radius += (this.baseRadius - this.radius) * 0.05;
                }
            }
        };

        Particle.prototype.draw = function() {
            var color = getColor();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = color + this.opacity + ')';
            ctx.fill();
        };

        // Create particles
        for (var i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            var color = getColor();
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        var opacity = (1 - dist / connectionDistance) * 0.2;
                        ctx.beginPath();
                        ctx.strokeStyle = color + opacity + ')';
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Mouse glow
        function drawMouseGlow() {
            if (mouse.x === null) return;
            var color = getColor();
            var gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
            gradient.addColorStop(0, color + '0.06)');
            gradient.addColorStop(1, color + '0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(mouse.x - mouse.radius, mouse.y - mouse.radius, mouse.radius * 2, mouse.radius * 2);
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawMouseGlow();
            drawConnections();

            for (var i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            animId = requestAnimationFrame(animate);
        }

        animate();

        // Track mouse relative to canvas
        document.addEventListener('mousemove', function(e) {
            mouse.x = e.clientX + window.scrollX;
            mouse.y = e.clientY + window.scrollY;
        });

        document.addEventListener('mouseleave', function() {
            mouse.x = null;
            mouse.y = null;
        });
    }

    // ============================================
    // Floating Geometric Shapes
    // ============================================
    function initFloatingShapes() {
        var container = document.getElementById('floatingShapes');
        if (!container) return;

        var shapes = [
            { type: 'circle', size: 60, x: '10%', y: '15%', duration: 22, delay: 0 },
            { type: 'ring', size: 80, x: '85%', y: '25%', duration: 28, delay: 2 },
            { type: 'diamond', size: 40, x: '70%', y: '60%', duration: 20, delay: 5 },
            { type: 'circle', size: 45, x: '25%', y: '70%', duration: 25, delay: 3 },
            { type: 'ring', size: 100, x: '50%', y: '40%', duration: 30, delay: 1 },
            { type: 'diamond', size: 35, x: '90%', y: '80%', duration: 18, delay: 4 },
            { type: 'circle', size: 25, x: '5%', y: '50%', duration: 24, delay: 6 },
            { type: 'triangle', size: 50, x: '40%', y: '85%', duration: 26, delay: 2 },
        ];

        shapes.forEach(function(s) {
            var el = document.createElement('div');
            el.className = 'floating-shape floating-shape--' + s.type;
            el.style.width = s.size + 'px';
            el.style.height = s.size + 'px';
            el.style.left = s.x;
            el.style.top = s.y;
            el.style.animationDuration = s.duration + 's, 1.5s';
            el.style.animationDelay = s.delay + 's, 0s';
            container.appendChild(el);
        });
    }

    // ============================================
    // Ambient Gradient Shift
    // ============================================
    function initAmbientGradient() {
        var gradient = document.getElementById('ambientGradient');
        if (!gradient) return;
    }

    // ============================================
    // Initialize
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initParticles();
        initFloatingShapes();
        initAmbientGradient();
    });

})();
