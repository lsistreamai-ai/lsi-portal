// Three.js Constellation Network Background - Light Theme Version
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Configuration
    const particleCount = 120;
    const connectionDistance = 15;
    const mouseInfluence = 20;

    // Mouse tracking
    const mouse = new THREE.Vector2(0, 0);
    const mouseTarget = new THREE.Vector2(0, 0);

    document.addEventListener('mousemove', (e) => {
        mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Create particles
    const particles = [];
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Light theme colors - blue/navy tones
    const color1 = new THREE.Color(0x1e3a5f);
    const color2 = new THREE.Color(0x3b82f6);

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 50;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const mixRatio = Math.random();
        const color = new THREE.Color().lerpColors(color1, color2, mixRatio);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        particles.push({
            x, y, z,
            vx: (Math.random() - 0.5) * 0.02,
            vy: (Math.random() - 0.5) * 0.02,
            vz: (Math.random() - 0.5) * 0.01
        });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x1e3a5f,
        transparent: true,
        opacity: 0.08
    });

    let linesGeometry = new THREE.BufferGeometry();
    let lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lines);

    const glowGeometry = new THREE.BufferGeometry();
    const glowCount = 20;
    const glowPositions = new Float32Array(glowCount * 3);

    for (let i = 0; i < glowCount; i++) {
        glowPositions[i * 3] = (Math.random() - 0.5) * 120;
        glowPositions[i * 3 + 1] = (Math.random() - 0.5) * 120;
        glowPositions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 20;
    }

    glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3));

    const glowMaterial = new THREE.PointsMaterial({
        size: 2.5,
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.08,
        sizeAttenuation: true
    });

    const glowParticles = new THREE.Points(glowGeometry, glowMaterial);
    scene.add(glowParticles);

    function animate() {
        requestAnimationFrame(animate);

        mouse.x += (mouseTarget.x - mouse.x) * 0.05;
        mouse.y += (mouseTarget.y - mouse.y) * 0.05;

        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;

            const dx = mouse.x * 30 - p.x;
            const dy = mouse.y * 30 - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouseInfluence) {
                const force = (mouseInfluence - dist) / mouseInfluence * 0.01;
                p.vx -= dx * force * 0.1;
                p.vy -= dy * force * 0.1;
            }

            if (p.x > 50) p.x = -50;
            if (p.x < -50) p.x = 50;
            if (p.y > 50) p.y = -50;
            if (p.y < -50) p.y = 50;
            if (p.z > 25) p.z = -25;
            if (p.z < -25) p.z = 25;

            p.vx *= 0.999;
            p.vy *= 0.999;
            p.vz *= 0.999;

            positions[i * 3] = p.x;
            positions[i * 3 + 1] = p.y;
            positions[i * 3 + 2] = p.z;
        }

        particleGeometry.attributes.position.needsUpdate = true;

        const linePositions = [];
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dz = particles[i].z - particles[j].z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < connectionDistance) {
                    linePositions.push(particles[i].x, particles[i].y, particles[i].z);
                    linePositions.push(particles[j].x, particles[j].y, particles[j].z);
                }
            }
        }

        linesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));

        glowParticles.rotation.y += 0.0002;
        glowParticles.rotation.x += 0.0001;

        camera.position.x = mouse.x * 2;
        camera.position.y = mouse.y * 2;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
})();
