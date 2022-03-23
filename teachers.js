const exp = require('constants');
const express = require('express');
const router = express.Router();
router.use( express.json() );
const admin = require('./firebase-config');
const FieldValue = require('firebase-admin').firestore.FieldValue;


const db = admin.firestore();

router.get('/', (req,res)=>{
    res.send("welcome to admin-console..");
})                            



router.post('/newProject', async(req,res) =>{

    console.log(req.body);
    try {
        const done = addNewProject(req.body);
        res.send("added...");
        return;
    }
    catch(err){
        console.log(err.message);
    }

    res.send("can't..");

})

async function addNewProject(project){


    const newProject = {

        name: project.name,
        details: project.details,
        by: project.projectOwner,  
        // this will be email address
        entries: []
    };

   
    return db.collection('projects')
    .add(newProject).then( () => {
        console.log('new project added..');
    })

}


router.post('/newEntry', async(req,res) => {

    try{
        
        console.log(req.body);
        const done = await addNewEntry(req.body);
        res.send("added..");
        return;
    }
    catch(err){
        console.log(err.message);
    }
    res.send("can't...");

   
})

async function addNewEntry(entry){

    const projectId = entry.projectId
    const projectRef = db.collection('projects').doc(String(projectId));

    const entryDetails = {
        by : entry.by,
        thesis: entry.thesis
    }


    const unionRes = await projectRef.update( {
        entries: FieldValue.arrayUnion( entryDetails )
    })

    return;
}

//get entries of a project of a teacher
router.get('/getEntries', async(req,res) => {

    const entries = await getEntries(req.body.projectId);
    // console.log(entries);
    // console.log(entries._fieldsProto.entries);
    const entryArray = entries._fieldsProto.entries.arrayValue;
    // console.log(entryArray.values);
    // console.log(entryArray);

    entryArray.values.forEach(doc => {
        console.log(doc.mapValue);
      })

    if(entryArray)
    {
        res.send(entryArray.values);
        return;
    }
    res.send("can't");
})

async function getEntries(projectId){

    const entriesRef = await db.collection('projects').doc(String(projectId)).get();
    return entriesRef;
}


router.get('/getSomeProjects', async(req,res) => {

    const projectRef = await db.collection('projects').where('by', '==', req.body.by).get();

    if(projectRef){
        console.log(projectRef);
        res.send(projectRef);

        projectRef.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
          });
        return;
    }
    res.send("no projects found");
})


//get projects of a teacher
router.get('/getProjects', async(req,res) =>{
    
    const projects = await getProjects();

    projects.forEach(doc => {
        console.log(doc.id, '=>', doc.data() );
    })

    if(projects){
        res.send(projects);
    }
    else{
        res.send("no projects found");
    }
})

async function getProjects(){

    const projectsRef = db.collection('projects');
    const projects = await projectsRef.get();
    return projects;
}













module.exports = router;
