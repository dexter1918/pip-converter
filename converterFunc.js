function combCheck()  //function to check for the conversion the user wants
{
	var inp=document.getElementById("input").value; //the input string stored in inp
	var prpoin;//variables for postfix to perfix conversion and vice versa
	var s1=document.first_dd.exp1.value; //the type of expression entered
	var s2=document.second_dd.exp2.value; //the type of equivalent expression the user wants
	var comb=""; //storing the coversion required
	var output="";
	if(inp=="")
	{
		comb="null";
	}
	else if(inp!="" && (s1=="--From--" || s2=="--To--"))
	{
	output="Choose From The Dropdowns!";
	}
	else{
	if(s1==s2) 
	{
		comb="same"; //when the input and desired output expression is same
	}
	else if(s1=="post" && s2=="pre")
	{
		comb="popr"; //postfix to prefix conversion switch
	}
	else if(s1=="pre" && s2=="post")
	{
		comb="prpo"; //prefix to postfix conversion switch
	}
	else if(s1=="post" && s2=="in")
	{
		comb="poin"; //postfix to infix conversion switch
	}
	else if(s1=="pre" && s2=="in")
	{
		comb="prin"; //prefix to infix conersion switch
	}
	else if(s1=="in" && s2=="post")
	{
		comb="inpo"; //infix to postfix conversion switch
	}
	else if(s1=="in" && s2=="pre")
	{
		comb="inpr"; //infix to prefix conversion switch
	}
	}
	switch(comb) //evaluating the required conversion
	{
		case 'null':
				output="Enter the Expression!";break;
		case 'same':
				output ="Choose another combination!";break;
		case 'poin':
				output=postToIn(inp);break;	
		case 'prin':
				output=preToIn(inp);break;
		case 'inpo':
				output=inToPost(inp);break;
		case 'inpr':
				output=inToPre(inp);break;
		case 'popr':
				prpoin=postToIn(inp);
				if(prpoin=="The entered postfix expression is not correct")
					output=prpoin;
				else
				{
					output=inToPre(prpoin);
					if(output=="The  entered infix expression is not correct")
					{
						output="The entered postfix expression is not correct";
					}
				}
				break;
		case 'prpo':
				prpoin=preToIn(inp);
				if(prpoin=="The entered prefix expression is not correct")
					output=prpoin;
				else
				{
					output=inToPost(prpoin);
					if(output=="The entered infix expression is not correct")
					{
						output="The entered prefix expression is not correct";
					}
				}
				break;
	}
	var output="<p id='output' style='font-size: 270%; margin-top: -4%; text-align: center; font-family: Comic Sans MS; color: White; overflow-wrap: break-word; word-wrap: break-word; '>"+output+"</p>";
	clearcontent();
	$("body").append(output);
}

function postToIn(st)  //Postfix to Infix Converter Function
{
	var ar=[]; //stack array
	var x; //variable for loop execution
	var count=0; //counter variable to keep track of the top of the stack
	var f=0;
	for (x in st)
	{
		if((st[x].charCodeAt(0)>=65 && st[x].charCodeAt(0)<=90) || (st[x].charCodeAt(0)>=97 && st[x].charCodeAt(0)<=122))
		{		
			ar.push(st[x]); //any alphabets encountered get pushed in the stack
			count+=1;
		}
		else if(count>=2)
		{	//aphabets getting popped on operator encounter
			var ch1=ar[count-1]; 
			var ch2=ar[count-2];
			ar.pop();
			ar.pop();
			count--;
			var s="("+ch2+""+st[x]+""+ch1+")";
			ar.push(s); //infix type equations getting pushed into stack
		}
		else
		{
			f=1;
			break;
		}
	}
	if(f==0 && count==1)
	{
		return ar[0]; //end result
	}
		return "The entered postfix expression is not correct";
}
function preToIn(st)  //Prefix to Infix Converter Function
{
	var ar=[]; //stack array
	var i; //variable for loop execution
	var len=st.length;
	var count=0; //counter variable to keep track of the top of the stack
	var f=0;
	for (i=len-1;i>=0;i--)
	{
		if((st.charCodeAt(i)>=65 && st.charCodeAt(i)<=90) || (st.charCodeAt(i)>=97 && st.charCodeAt(i)<=122))
		{		
			ar.push(st.charAt(i)+""); //any alphabets encountered get pushed in the stack
			count+=1;
		}
		else if(count>=2)
		{	//aphabets getting popped on operator encounter
			var ch1=ar[count-1];
			var ch2=ar[count-2];
			ar.pop();
			ar.pop();
			count--;
			var s="("+ch1+""+st.charAt(i)+""+ch2+")";
			ar.push(s); //infix type equations getting pushed into stack
		}
		else
		{
			f=1;
			break;
		}
	}
	if(f==0 && count==1)
		return ar[0]; //end result
	return "The entered prefix equation is not correct";
}
function inToPost(st) //Infix to Postfix converter
{
	var ar1=[]; //stack array
	var ar2=""; //desired postfix expression in string format
	var ar3=[]; //array to store the priority of the operators stored in stack array
	var x; //variable for loop execution
	var count=0; //counter to keep the track of the top of the stack
	var f=0;
	if(st[0]=="^"||st[0]=="+"||st[0]=="-"||st[0]=="*"||st[0]=="/"||st[0]==")"||st[st.length-1]=="^"||st[st.length-1]=="+"||st[st.length-1]=="-"||st[st.length-1]=="*"||st[st.length-1]=="/"||st[st.length-1]=="(")
	{
		return "The entered infix expression is not correct";
	}
	for(x in st)
	{
		if((st.charCodeAt(x)>=65 && st.charCodeAt(x)<=90) || (st.charCodeAt(x)>=97 && st.charCodeAt(x)<=122))
		{
			if(x!=0 && (st[x-1]==")"||(st.charCodeAt(x-1)>=65 && st.charCodeAt(x-1)<=90) || (st.charCodeAt(x-1)>=97 && st.charCodeAt(x-1)<=122)))
				f=-1;
			ar2=ar2.concat(st[x]); //operands get directly added to the postfix string
		}
		else if(st[x]=="(")
		{
			if(x!=0 && ((st[x-1].charCodeAt(0)>=65 && st[x-1].charCodeAt(0)<=90) || (st[x-1].charCodeAt(0)>=97 && st[x-1].charCodeAt(0)<=122)))
			{
				f=-1;
				break;
			}
			ar1.push(st[x]); //any opening brackets are pushed directly into the stacked
			ar3.push(0); //least priority is given to brackets in the stack
			count+=1;
			f+=1;
		}
		else if(st[x]==")") //when a closing bracket is encountered
		{
			if(x==0||st[x-1]=="^"||st[x-1]=="*"||st[x-1]=="/"||st[x-1]=="+"||st[x-1]=="-")
				f=-1;
			f-=1;
			if(f<0)
			{
				break;
			}
			while(count>0&&ar1[count-1]!="\0"&&ar1[count-1]!="(")
			{//adding all the operators of stack to the string until an opening bracket is encountered in the stack
				ar2=ar2.concat(ar1[count-1]);
				ar1.pop();
				ar3.pop();
				count-=1;
			}
			if(ar1[count-1]=="(")
			{//popping the opening bracket left
				ar1.pop();
				ar3.pop();
				count-=1;
			}
		}
		else if(st[x]=="^")
		{//^ operator gets the highest priority
			if(x==0||st[x-1]=="^"||st[x-1]=="*"||st[x-1]=="/"||st[x-1]=="+"||st[x-1]=="-"||st[x-1]=="(")
				f=-1;
			ar1.push(st[x]);
			ar3.push(3);
			count+=1;
		}
		else if(st[x]=="*"||st[x]=="/")
		{//* and / operator get the highest priority after ^
			if(st[x-1]=="^"||st[x-1]=="*"||st[x-1]=="/"||st[x-1]=="+"||st[x-1]=="-"||st[x-1]=="(")
				f=-1;
			ar1.push(st[x]);
			ar3.push(2);
			count+=1;
		}
		else if(st[x]=="+"||st[x]=="-")
		{//+ and - operator get the least priority but more than brackets
			if(st[x-1]=="^"||st[x-1]=="*"||st[x-1]=="/"||st[x-1]=="+"||st[x-1]=="-"||st[x-1]=="(")
				f=-1;
			ar1.push(st[x]);
			ar3.push(1);
			count+=1;
		}
		if(f<0)
			break;
		if(ar3[count-1]!=0&&ar3[count-2]!=0&&count>1)
		{//if there are more than 1 operators in the stack and the top 2 of them are not parentheses
			while(true)
			{
				if(ar3[count-1]==ar3[count-2]||ar3[count-1]<ar3[count-2])
				{/*if the top two operators have same priority or an operator with lower priority is above one with 				higher priority*/
					ar2=ar2.concat(ar1[count-2]);
					//the operator below the top of the stack is put into the string and popped from the stack
					ar3[count-2]=ar3[count-1];
					ar1[count-2]=ar1[count-1];
					ar1.pop();
					ar3.pop();
					count-=1;
				}
				else
					break;
			}
		}
	}
	if(f==0)
	{
	while(count>0)
	{//popping the remaining operators in the stack and putting them into the string
		ar2=ar2.concat(ar1[count-1]);
		ar1.pop();
		ar3.pop();
		count-=1;
	}}
	else
	ar2="The entered infix expression is not correct";
	return ar2;
}
function inToPre(st) //infix to prefix converter
{
	var check;
	check=inToPost(st);
	if(check=="The entered infix expression is not correct")
		return "The entered infix expression is not correct";
	var ar1=[]; //array to store characters
	var ar2; //variable to store the desired expression in string format
	var x; // variable for loop execution
	/*the infix expression is reversed*/
	ar1=st.split(""); //the infix expression is split into characters and stored in the array
	ar1=ar1.reverse(); //the array is reversed
	for(x in ar1)
	{//the opening brackets are converted to closing ones and vice versa
		if(ar1[x]=="(")
			ar1[x]=")";
		else if(ar1[x]==")")
			ar1[x]="(";
	}
	st=ar1.join(""); //the reversed array is joined back to form a string
	st=inToPost(st); //the reversed infix expression is converted to postfix
	/*the postfix expression is reversed the same way as the infix expression*/
	ar1=st.split("");
	ar1=ar1.reverse();
	ar2=ar1.join("");
	return ar2; //thus the desired prefix expression is produced and returned succesfully
}
function swap()
{
	if(document.first_dd.exp1.value!="--From--" && document.second_dd.exp2.value!="--To--")
	{
		var temp = document.first_dd.exp1.value;
		document.first_dd.exp1.value = document.second_dd.exp2.value;
		document.second_dd.exp2.value = temp;
	}
}
function clearcontent() 
{ 
	try
	{
		$("#output").remove();
	}
	catch(err){}
} 
function clearinputbox()
{
	$("#input").val("");
	clearcontent();
}
$(document).keydown(function(e){
    if(e.which === 123){
 
       return false;
 
    }
 
});