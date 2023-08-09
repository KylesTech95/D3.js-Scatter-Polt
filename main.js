const drive = () => {
$(document).ready(function(){
    d3.select('body')
        .append('div')
        .attr('id','title')
        .html('Doping in Professional Bicycle Racing')
    const render = (url) =>{
        d3.json(url)
          .then(data =>{//onlaod
    let size = {
        width: 900,
        height: 700,
        margin:{
            x:120,
            y:60
        },
        legend:{
            x:60,
            y:30
        }
        }
        //Global Declarations
        let svg = d3.select('body')
                    .append('svg')
                    .attr('id','svg')
                    .attr('height',size.height)
                    .attr('width',size.width)
        let tooltip = d3.select('body')
                        .append('div')
                        .attr('id','tooltip')
                        .attr('style','opacity:0')
        let general = [], dope = [], name = [], nation = [], place = [], seconds = [], time = [], url = [], year = [];
        for(let x in data){//iteration of data
            dope.push(data[x].Doping)
            name.push(data[x].Name)
            nation.push(data[x].Nationality)
            place.push(data[x].Place)
            seconds.push(data[x].Seconds)
            time.push(data[x].Time)
            url.push(data[x]['URL'])
            year.push(data[x].Year)
            general.push(data[x])
        }
        //min & max Declarations
        let min = d3.min(year,y=>y),
            max = d3.max(year,y=>y)
        //xScale
        let xScale = d3.scaleLinear()
                        .domain([min - 1,max])
                        .range([size.margin.x,size.width-size.margin.x])
        //xAxis
        let xAxis = d3.axisBottom(xScale).tickFormat(d=>d)
        //append Group x-Axis
        svg.append('g')
           .attr('id','x-axis')
           .attr('style',`transform: translate(0,${size.height-size.margin.y}px)`)
           .call(xAxis)
        //------------------------------------------------------------
        //yScale - scaleTime requires "Date Objects"
        //remember to apply "milliseconds" to the date object
        let yScale = d3.scaleTime()
                        .domain([d3.max(seconds,d=>new Date(d*1000)),d3.min(seconds,d=>new Date(d* 1000))])
                        .range([size.height - size.margin.y,size.margin.y])
        //yAxis
        //d3.timeFormat works well with d3.scaleTime() - Formatted Minutes & Seconds
        let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'))
        //append Group x-Axis
        svg.append('g')
           .attr('id','y-axis')
           .attr('style',`transform: translate(${size.margin.x}px,0)`)
           .call(yAxis)
    //Create circles - xc, cy, r(radius)
         svg.append('g')
            .selectAll('circle')
            .data(general)
            .enter()
            .append('circle')
            .classed('dot',true)
            //set attributes in d3.js
            .attr('data-xvalue',d=>d.Year).attr('data-yvalue',d=>new Date(d.Seconds*1000))
            .attr('cx',d=>xScale(d.Year))
            .attr('cy',d=>yScale(new Date(d.Seconds*1000)))
            .attr('r',5)
            .on('mouseover',(d)=>{
                //add tooltip
                let tool = document.getElementById('tooltip')
                tool.setAttribute('data-year', d.target.__data__.Year)
                tooltip.attr('style',`left:${xScale(d.target.__data__.Year)}px;top:${yScale(new Date(d.target.__data__.Seconds*1000))}px;opacity:.8;display: block;`)
                .html(`${d.target.__data__.Name}: ${d.target.__data__.Nationality}<br>Year: ${d.target.__data__.Year},Time: ${d.target.__data__.Time}<br><br>${d.target.__data__.Doping}`)
    
            })
            .on('mouseout',(d)=>{
                tooltip.attr('style',`display: none;`)
    
            })
    
            //create legend
            svg.append('g')
               .attr('id','legend')
               
            //Xscale legend text
            svg.select('#legend')
            .append('text')
            .classed('legendX',true)
            .html('Years')
            .attr('style',`transform: translate(${(size.width / 2)}px,${size.height - size.legend.y}px)`)   
            //Yscale legend text
            svg.select('#legend')
            .append('text')
            .classed('legendY',true)
            .html('Time in Minutes')
            .attr('style',`transform: translate(${size.legend.x}px,${(size.height/2)-size.margin.y}px) rotate(90deg)`)
    
    
    
    
            
        })
    
    }
    render('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
                
    
    })
    
}