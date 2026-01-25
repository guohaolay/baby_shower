import { Engine, Events, Render, Runner, Bodies, Composite, Constraint, World, Mouse, MouseConstraint } from "matter-js";
import { useEffect, useRef } from "react";

export const HotBalloon = () => {
    const ref = useRef(null);

    function createRope(startX: number, startY: number, segmentCount: number, segmentSize: number, stiffness: number, world: World) {
        var previousBody = null;
        for (var i = 0; i < segmentCount; i++) {
            // Create a new body (e.g., a small rectangle) for the rope segment
            var currentBody = Bodies.rectangle(startX, startY + i * segmentSize, segmentSize, segmentSize, {
                density: 0.05, // Lower density makes it less like a heavy chain
                frictionAir: 0.01,
                render: {
                    visible: false
                }
            });

            // Add the current body to the world
            Composite.add(world, currentBody);

            // If it's not the first segment, connect it to the previous one
            if (previousBody) {
                var constraint = Constraint.create({
                    bodyA: previousBody,
                    bodyB: currentBody,
                    length: segmentSize, // The resting length of the constraint
                    stiffness: stiffness, // Controls how much the rope can stretch
                    damping: 0.5, // Adds some resistance to oscillation
                    render: {
                        visible: false
                    }
                });
                Composite.add(world, constraint);
            } else {
                // For the first segment, you might want to attach it to a static point or body
                var staticConstraint = Constraint.create({
                    pointA: { x: startX, y: startY }, // Static attachment point
                    bodyB: currentBody,
                    length: 0, // No initial length as it's the attachment point
                    stiffness: 1,
                    render: {
                        visible: false
                    }
                });
                Composite.add(world, staticConstraint);
            }

            // Set the current body as the previous body for the next iteration
            previousBody = currentBody;
        }
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
        var boxA = Bodies.circle(400, 200, 80,);
        var boxB = Bodies.circle(450, 200, 80);
        var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
        createRope(200, 50, 10, 30, 0.5, engine.world);
        // add all of the bodies to the world
        Composite.add(engine.world, [boxA, boxB, ground]);

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
                    visible: false // Hides the line connecting your mouse to the object
                }
            }
        });

        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        Events.on(render, 'afterRender', () => {
            const context = render.context;
            const bodies = Composite.allBodies(engine.world).filter(b => !b.isStatic);

            if (bodies.length < 2) return;

            context.beginPath();
            context.moveTo(bodies[0].position.x, bodies[0].position.y);

            // Draw a curve through the segments
            for (let i = 1; i < bodies.length; i++) {
                // We use the midpoint between segments to create a smooth quadratic curve
                const xc = (bodies[i].position.x + bodies[i - 1].position.x) / 2;
                const yc = (bodies[i].position.y + bodies[i - 1].position.y) / 2;
                context.quadraticCurveTo(bodies[i - 1].position.x, bodies[i - 1].position.y, xc, yc);
            }

            context.lineTo(bodies[bodies.length - 1].position.x, bodies[bodies.length - 1].position.y);

            context.strokeStyle = "#8B4513"; // Rope color
            context.lineWidth = 4;
            context.lineCap = "round";
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

    return <> hot balloon
        <section ref={ref}></section>
    </>

}
