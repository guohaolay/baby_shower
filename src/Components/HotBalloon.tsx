import { Engine, Events, Render, Runner, Bodies, Composite, Constraint, World, Mouse, MouseConstraint, Body } from "matter-js";
import { useEffect, useRef } from "react";
import logo from '../images/balloon.png'

const BALLOON_RADIUS = 50;

export const HotBalloon = () => {
    const ref = useRef(null);

    function createRope(parent: Body, segmentCount: number, segmentSize: number, stiffness: number) {
        const ropeComposite = Composite.create();

        const startX = parent.position.x;
        const startY = parent.position.y;
        let previousBody = parent;

        for (var i = 0; i < segmentCount; i++) {
            // Create a new body (e.g., a small rectangle) for the rope segment
            var currentBody = Bodies.rectangle(
                startX,
                startY + (i + 1) * segmentSize,
                1,
                segmentSize,
                {
                    density: 0.001, // Lower density makes it less like a heavy chain
                    frictionAir: 0.5,
                    collisionFilter: { group: -1 },
                    render: {
                        visible: false
                    }
                });

            // Add the current body to the world
            Composite.add(ropeComposite, currentBody);

            var constraint = Constraint.create({
                bodyA: previousBody,
                bodyB: currentBody,
                ...(i === 0 ? {
                    pointA: { x: 0, y: BALLOON_RADIUS },
                    pointB: { x: 0, y: -segmentSize / 2 }
                } : {}),
                length: segmentSize, // The resting length of the constraint
                stiffness: stiffness, // Controls how much the rope can stretch
                damping: 0.5, // Adds some resistance to oscillation
                render: {
                    visible: false
                }
            });

            Composite.add(ropeComposite, constraint);
            previousBody = currentBody;
        }

        return ropeComposite;
    }

    const createBalloon = (startX: number, startY: number) => {
        const balloon = Bodies.circle(startX, startY, BALLOON_RADIUS, {
            collisionFilter: { group: -1 },
            sleepThreshold: -1, // Prevents the balloon from ever falling asleep
            frictionAir: 0.05,
            render: {
                sprite: {
                    texture: logo,
                    xScale: 1,
                    yScale: 1,
                }
            }
        });
        const rope = createRope(balloon, 5, 30, 1);
        return {
            balloon,
            rope,
        };
    }

    useEffect(() => {
        if (!ref.current) {
            return;
        }
        // create an engine
        var engine = Engine.create();

        // create a renderer
        var render = Render.create({
            element: ref.current,
            engine: engine,
            options: {
                wireframes: false,
                background: 'transparent'
            }
        });

        // create two boxes and a ground
        var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
        const balloon = createBalloon(400, 80);

        // add all of the bodies to the world
        Composite.add(engine.world, [ground, balloon.balloon, balloon.rope]);

        // run the renderer
        Render.run(render);

        // create runner
        var runner = Runner.create();

        // run the engine
        Runner.run(runner, engine);

        // add mouse interactivity
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        Events.on(engine, 'beforeUpdate', () => {
            const force = 0.01; // Lower force is usually better for smooth floating
            const balloonTop = balloon.balloon.bounds.min.y;

            // Only apply upward force if we haven't hit the top of the canvas
            if (balloonTop > 0) {
                Body.applyForce(balloon.balloon, balloon.balloon.position, { x: 0, y: -force });
            }
        });

        Events.on(render, 'afterRender', () => {
            const context = render.context;
            const parent = balloon.balloon;
            const segments = Composite.allBodies(balloon.rope);

            // Use trigonometry to find the point on the circle's edge relative to rotation
            // BALLOON_RADIUS is the distance from center, parent.angle is the rotation in radians
            const attachX = parent.position.x + Math.sin(-parent.angle) * BALLOON_RADIUS;
            const attachY = parent.position.y + Math.cos(parent.angle) * BALLOON_RADIUS;

            context.beginPath();
            context.moveTo(attachX, attachY);

            // 3. Draw to the first segment
            const firstSegment = segments[0];
            context.lineTo(firstSegment.position.x, firstSegment.position.y);

            // 4. Continue through the rest of the segments
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

        return () => {
            Render.stop(render);
            Runner.stop(runner);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        };
    }, [ref.current]);

    return <section ref={ref}></section>

}
