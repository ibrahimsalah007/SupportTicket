const express = require('express');

const Ticket = require('../models/Ticket')

const router = express.Router();

router.get('/', (req,res) =>{
    res.json({success:true, message: 'Hello'});
})


router.post('/new', async (req,res) =>{
    try{
        const {message, email, name, phoneNumber, source} = req.body

        const ticket = new Ticket();

        // let Activity = {
        //     activity: {
        //         by: 'by'
        //     }
        // }
        //Activity.activity = {by:'by', dateCreated:Date.now()}
        //console.log(Activity)
        // console.log(ticket.schema.path('priority').enumValues)
        if (req.user != undefined) {
            ticket.createdBy = req.user.role < 1 ? 'User' : 'Admin'
        }
        ticket.message = 'Message';
        ticket.email = 'test@test.com';
        ticket.name = 'Tester';
        ticket.phoneNumber = '01019093332';
        ticket.source = 'Contact US';
        await ticket.save()
        res.json({success:true, message: ticket});
    }catch(err){
        res.json({success:false, message: err});
    }
})

router.get('/details/:id', async (req,res) =>{
    try{
        const {id} = req.params;
        if(!id)
            return res.json({success:false, message: 'Ticket ID is required.'});

        const ticket = await Ticket.findById(id);
        
        if(!ticket)
            return res.json({success: false, message: 'Invalid Ticket ID'})

        if(ticket.seen == false){
            ticket.seen = true;
            await ticket.save();
        }
        
        res.json({success:true, message: ticket});
    }catch(err){
        res.json({success:false, message: err});
    }
});

//gotta ensure that Admin is authenticated
router.put('/update/:id', async (req,res) =>{
    try{
        const {id} = req.params;
        if(!id)
            return res.json({success:false, message: 'Ticket ID is required.'});

            const {content, priority, status, service} = req.body;

        const ticket = await Ticket.findById(id);
        
        if(!ticket)
            return res.json({success: false, message: 'Invalid Ticket ID'})

        // if(ticket.status == 'Closed')
        //     return res.json({success: false, message: 'Ticket is Closed'})

        if(ticket.status == 'New')
            ticket.status = 'Open';
        if(ticket.seen == false)
            ticket.seen = true;
        if(content)
            ticket.Activities.push({activity:{content, by:'Logged-in admin'}});
        if(priority)
            ticket.priority = priority;
        if(status)
            ticket.status = status;
        if(service)
            ticket.service = service;
        
        ticket.observer = 'Logged-in admin'
        await ticket.save();
        
        
        res.json({success:true, message: 'Successfully Updated', ticket});
    }catch(err){
        res.json({success:false, message: err});
    }
});
//gotta ensure that Admin is authenticated
router.delete('/remove/:id', async (req,res) =>{
    try{
        const {id} = req.params;
        if(!id)
            return res.json({success:false, message: 'Ticket ID is required.'});


        const ticket = await Ticket.findByIdAndRemove(id);
        
        if(!ticket)
            return res.json({success: false, message: 'Invalid Ticket ID'})

       
        res.json({success:true, message: 'Successfully Removed'});
    }catch(err){
        res.json({success:false, message: err});
    }
});



module.exports = router;