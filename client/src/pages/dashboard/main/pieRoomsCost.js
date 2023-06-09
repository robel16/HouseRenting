import { useValue } from '../../../context/ContextProvider';
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell , Tooltip} from "recharts";



const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
export default function PieRoomsCost() {
  const {state: {rooms}}= useValue()
  const [costGroups, setCostGroups]= useState([])
  
  useEffect (()=>{
    let free=0, lessThan750=0, between750And1200=0, moreThan1200=0
    rooms.forEach(room => {
      if(room.price===0) return free++
      if(room.price < 750) return lessThan750++
      if(room.price <= 1200) return between750And1200++
      moreThan1200++
    });
    setCostGroups([
      {name:'Free Stay', qty:free},
      {name:'Less Than ETB750', qty:lessThan750},
      {name:'Between ETB750-1200', qty:between750And1200},
      {name:'more Than ETB1200', qty:moreThan1200},
    ])
  },[rooms])
  return (
    <Box
    sx={{
      display:'flex',
      alignItems:'center',
      justifyContent:'space-evenly',
      flexWrap:'wrap'
    }}>
    <PieChart width={200} height={200}>
      <Pie
        data={costGroups}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={80}
        fill="#8884d8"
        dataKey="qty"
      >
        {costGroups.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip/>
    </PieChart>
    <Stack gap={2}>
      <Typography variant='h6'>Guest House Cost</Typography>
      <Box sx={{display:'flex', gap:3, flexWrap:'wrap'}}>
        {COLORS.map((color,i)=>(
          <Stack key={color} alignItems='center' spacing={1}>
            <Box sx={{width:20, height:20, background:color}}/>
            <Typography variant='body2' sx={{opacity:0.7}}>{costGroups[i]?.name}</Typography>
          </Stack>

        ))}
      </Box>
    </Stack>
    </Box>
  );
}
