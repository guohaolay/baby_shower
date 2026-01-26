import { Engine, Events, Render, Runner, Bodies, Composite, Constraint, Mouse, MouseConstraint, Body } from "matter-js";
import { useEffect, useRef } from "react";
import logo from '../images/balloon.png'

const BALLOON_RADIUS = 50;

export const HotBalloon = () => {
    const ref = useRef<HTMLDivElement>(null);

    function createRope(parent: Body, segmentCount: number, segmentSize: number, stiffness: number) {
        const ropeComposite = Composite.create();
        const startX = parent.position.x;
        const startY = parent.position.y;
        let previousBody = parent;

        for (var i = 0; i < segmentCount; i++) {
            var currentBody = Bodies.rectangle(
                startX,
                startY + (i + 1) * segmentSize,
                10,
                segmentSize,
                {
                    density: 0.001,
                    frictionAir: 0.5,
                    collisionFilter: { group: -1 },
                    render: { visible: false }
                });

            Composite.add(ropeComposite, currentBody);

            var constraint = Constraint.create({
                bodyA: previousBody,
                bodyB: currentBody,
                ...(i === 0 ? {
                    pointA: { x: 0, y: BALLOON_RADIUS },
                    pointB: { x: 0, y: -segmentSize / 2 }
                } : {}),
                length: segmentSize,
                stiffness: stiffness,
                damping: 0.5,
                render: { visible: false }
            });

            Composite.add(ropeComposite, constraint);
            previousBody = currentBody;
        }

        return ropeComposite;
    }

    const createBalloon = (startX: number, startY: number) => {
        // 1. Smaller physics radius (the "hitbox")
        const HITBOX_RADIUS = BALLOON_RADIUS * 0.9;

        const balloonBody = Bodies.circle(startX, startY, HITBOX_RADIUS, {
            collisionFilter: { category: 0x0001 },
            sleepThreshold: -1,
            frictionAir: 0.05,
            restitution: 0.7,
            render: {
                sprite: {
                    texture: logo,
                    // 2. Scale the image up so it is larger than the hitbox
                    xScale: 1.15,
                    yScale: 1.15,
                }
            }
        });

        // Note: The rope still needs to attach to the bottom of the VISUAL balloon
        // so we use the full BALLOON_RADIUS for the attachment math.
        const rope = createRope(balloonBody, 5, 30, 1);

        return { body: balloonBody, rope: rope };
    }

    useEffect(() => {
        if (!ref.current) return;

        var engine = Engine.create();
        var render = Render.create({
            element: ref.current,
            engine: engine,
            options: {
                wireframes: false,
                background: 'transparent',
                width: 800,
                height: 600
            }
        });

        var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

        // --- MULTIPLE BALLOONS SETUP ---
        const balloonPositions = [
            { x: 200, y: 100 },
            { x: 400, y: 150 },
            { x: 600, y: 80 }
        ];

        const balloons = balloonPositions.map(pos => createBalloon(pos.x, pos.y));

        // Add everything to the world
        balloons.forEach(b => {
            Composite.add(engine.world, [b.body, b.rope]);
        });
        Composite.add(engine.world, [ground]);

        Render.run(render);
        var runner = Runner.create();
        Runner.run(runner, engine);

        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: { stiffness: 0.2, render: { visible: false } }
        });
        Composite.add(engine.world, mouseConstraint);

        // --- PHYSICS UPDATE (BUOYANCY) ---
        Events.on(engine, 'beforeUpdate', () => {
            const force = 0.01;
            balloons.forEach(b => {
                const balloonTop = b.body.bounds.min.y;
                if (balloonTop > 0) {
                    Body.applyForce(b.body, b.body.position, { x: 0, y: -force });
                }
            });
        });

        // --- CUSTOM RENDERING (ROPES) ---
        Events.on(render, 'afterRender', () => {
            const context = render.context;

            balloons.forEach(b => {
                const parent = b.body;
                const segments = Composite.allBodies(b.rope);

                const attachX = parent.position.x + Math.sin(-parent.angle) * BALLOON_RADIUS;
                const attachY = parent.position.y + Math.cos(parent.angle) * BALLOON_RADIUS;

                context.beginPath();
                context.moveTo(attachX, attachY);

                const firstSegment = segments[0];
                context.lineTo(firstSegment.position.x, firstSegment.position.y);

                for (let i = 1; i < segments.length; i++) {
                    const xc = (segments[i].position.x + segments[i - 1].position.x) / 2;
                    const yc = (segments[i].position.y + segments[i - 1].position.y) / 2;
                    context.quadraticCurveTo(segments[i - 1].position.x, segments[i - 1].position.y, xc, yc);
                }

                const lastPoint = segments[segments.length - 1];
                context.lineTo(lastPoint.position.x, lastPoint.position.y);

                context.strokeStyle = "#8B4513";
                context.lineWidth = 2;
                context.stroke();
            });
        });

        return () => {
            Render.stop(render);
            Runner.stop(runner);
            Engine.clear(engine);
            render.canvas.remove();
        };
    }, []);

    return <section ref={ref}></section>;
}