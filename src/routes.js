const express = require('express');
const routes = express.Router();

const views = __dirname + '/views/'

const Profile = {
    data:{
        name: "Gustavo Detomi",
        avatar: "https://github.com/gudetomi.png",
        "monthly-budget":3000,
        "days-per-week":5,
        "hours-per-day":5,
        "vacation-per-year":4,
        "value-hour":75
    },
    controllers:{
        index(req,res){
            return res.render(views + "profile",{profile: Profile.data})
        },
        update(req,res){
            //req.body para pegar os dados
            //definir quantas semanas tem em um ano
            //remover as semanas de ferias do ano
            //quantas horas por semana estou trabalhando
            //total de horas trabalhadas no mes
        }
    }
}

const Job = {
    data:[
        {
            id:1,
            name:"Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours":60,
            created_at: Date.now()
        },
        {
            id:2,
            name:"One Two Project",
            "daily-hours": 2,
            "total-hours":120,
            created_at: Date.now()
        }
    ],
    controllers:{
        index(req,res){
            const updatedJobs = Job.data.map((job)=>{
                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? 'done' : 'progress'
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Profile.data["value-hour"] * job["total-hours"]
                }
            })
            return res.render(views + "index",{ jobs: updatedJobs })
        },
        save(req,res){
            const jobId = Job.data[Job.data.length - 1]?.id || 1;
            Job.data.push({
                id:jobId,
                name : req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            })
            return res.redirect('/')
        },
        create(req,res){
            return res.render(views + "job")
        }
    },
    services:{
        remainingDays(job){
            const remainingDays = (job["total-hours"]/job["daily-hours"]).toFixed()
            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(remainingDays)
            const dueDateInMs = createdDate.setDate(dueDay)
        
            const timeDiffInMs = dueDateInMs - Date.now()
            //transformar mili em dias
            const dayInMs = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDiffInMs/ dayInMs)
        
            return dayDiff
        }
    }
}

routes.get('/',Job.controllers.index)

routes.get('/job',Job.controllers.create)

routes.post('/job',Job.controllers.save)
routes.get('/job/edit',(req,res)=> res.render(views + "job-edit"))
routes.get('/profile',Profile.controllers.index)
routes.post('/profile',Profile.controllers.update)


module.exports = routes;