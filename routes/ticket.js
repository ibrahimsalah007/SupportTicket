const express = require('express');

const Ticket = require('../models/Ticket')

const router = express.Router();

const escapeRegex = function (query) {
    return query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
const searchQuery= function (query) {
try {
    //const { escapeRegex } = require('./queryFunctions')
    let bearer = {}
    for (var queryKey in query) {
        if (query.hasOwnProperty(queryKey)) {
            let queryValue = Object.values({ [query[queryKey]]: query[queryKey] }).toString()
            regex = new RegExp(escapeRegex(queryValue), 'gi');
            bearer[queryKey] = regex
        }
    }
    
    console.log(bearer)
    
    return bearer
} catch (err) {
    console.log(err)
}
}

router.get('/', async (req,res) =>{
try{
    //console.log('body', req.body.search)
    // const {sortBy, order} = req.query;
    let {search, sortBy} = req.body;
    if(search == undefined || search == null || search == '' || search == {})
        search = {}
    else
        search = searchQuery(search)

    if( !sortBy || sortBy.length < 1 || sortBy == undefined)
        sortBy = {createdAt: -1}

    const tickets = await Ticket.find(search)
    .sort(sortBy);
    if(tickets.length < 1)
        return res.json({success:false, message: 'لا يوجد تذاكر'});
    
    res.json({success:true, message: tickets});
}catch(err){
    res.json({success:false, message: err.message});
}

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
        ticket.message = message;
        ticket.user.email = email;
        ticket.user.name = name;
        ticket.user.phoneNumber = phoneNumber;
        ticket.source = source;
        await ticket.save()
        res.json({success:true, message: ticket});
    }catch(err){
        res.json({success:false, message: err.message});
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