var hitsSet = null;
var hitsGeometry = null;
var shaderMaterial = null;

function draw_event(event) {
    console.log(event);

    if( hitsSet !== null) {
        console.log("Removing old hits set");
        scene.remove( hitsSet );
        if( hitsGeometry !== null ) {
            console.log("Disposing Geometry");
            hitsGeometry.dispose();
        }
        if( shaderMaterial !== null ) {
            console.log("Disposing ShaderMaterial");
            shaderMaterial.dispose();
        }
    }

    var hits = event.hits;
    var n_hits = hits.pos.length;
    var t_min = Math.min.apply(Math, hits.time);
    var t_max = Math.max.apply(Math, hits.time);

    console.log("Hit time range: " + t_min + " to " + t_max);

    hitsGeometry = new THREE.BufferGeometry();
    var positions = new THREE.BufferAttribute(
        new Float32Array(n_hits * 3), 3, 1
    )
    hitsGeometry.addAttribute( 'position', positions );
    hitsGeometry.addAttribute(
        'tot',
        new THREE.BufferAttribute(
            new Float32Array(event.hits.tot), 1
        )
    );
    hitsGeometry.addAttribute(
        'time',
        new THREE.BufferAttribute(
            new Float32Array(event.hits.time), 1
        )
    );

    for(i =0; i < n_hits; i++) {
        positions.setXYZ(i, hits.pos[i][0], hits.pos[i][1], hits.pos[i][2]);
    }
    console.log(hits.time);

//    _.each(event.hits.pos, function(pos) {
//        var vec3 = new THREE.Vector3(pos[0], pos[1], pos[2]);
//        hitsGeometry.vertices.push(vec3);
//        hitsGeometry.verticesNeedUpdate = true;
//        hitsGeometry.uvsNeedUpdate = true;
//    });

    var customUniforms = THREE.UniformsUtils.merge(
	[THREE.UniformsLib['lights'],
	{
	  color: {type: 'c', value: new THREE.Color(0x0000ff)},
          t_min: t_min,
          t_max: t_max,
	}
	]
    )

    shaderMaterial = new THREE.RawShaderMaterial(
    {
	uniforms: customUniforms,
	vertexShader:  testVShader,
	fragmentShader: testFShader,
	lights: true,
    });

    hitsSet = new THREE.Points( hitsGeometry, shaderMaterial );
    hitsSet.position.set(0, 0, 0);
    hitsSet.dynamic = true;
    hitsSet.sortParticles = false;
    scene.add( hitsSet );

}
