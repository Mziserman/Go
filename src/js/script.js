var Board = function(target)
{
	this.init(target);
};

Board.prototype = 
{
	init : function(target)
	{
		this.main = target.target;
		this.boardVirtual = new Array;
		this.player = new Array;

		this.createPlayer(1,"le dragon","black");
		this.createPlayer(2,"la tortue","white");
		this.actualPlayer = 1;

		this.createBoard(6);
		this.boardPhysic = this.print(this.main,this.boardVirtual);
		this.cells = this.boardPhysic.find(".cell");

		var that = this;

		this.cells.on("click",function()
		{
			var virtualCell = that.physicToVirtual(this);
			console.log(virtualCell);
			console.log(that.boardVirtual[virtualCell['column']][virtualCell['line']].checked);

			if ( virtualCell == 0 && that.checkCell(virtualCell['column'],virtualCell['line'],0) > 0 )
				console.log("c'est pas la condition bitch");
				that.changeValueCell(this,virtualCell['column'],virtualCell['line'],that.player[that.actualPlayer]);
		});


	},

	physicToVirtual : function(cell)
	{
		var virtual = new Array;

		virtual['column'] = Number($(cell).attr("class").substring($(cell).attr("class").lastIndexOf('column-') + 7,$(cell).attr("class").lastIndexOf('column-') + 8));
		virtual['line'] = Number($(cell).attr("class").substring($(cell).attr("class").lastIndexOf('line-') + 5,$(cell).attr("class").lastIndexOf('line-') + 6));

		return virtual;
	},

	createBoard : function(size)
	{
		var that = this;

		for ( i = 0; i < size + 2; i ++)
		{
			that.boardVirtual[i] = new Array;
			for ( j = 0; j < size + 2; j ++)
			{
				that.boardVirtual[i][j] = new that.cell(i,j);
			}
		}
	},

	cell : function(column,line)
	{
		this.id = column + "-" + line; 
		this.column = column;
		this.line = line;
		this.state = 0;
		this.checked = 0;
	},

	changeValueCell : function(cell,column,line,player)
	{
		this.boardVirtual[column][line].state = player.value;
		$(cell).addClass(player.color);
	},

	clearChecked : function()
	{
		var that = this;
		for ( i = 0; i < that.boardVirtual.length; i ++)
		{
			for ( j = 0; j < that.boardVirtual[i].length; j ++)
			{
				that.boardVirtual[i][j].checked = 0;
			}
		}
	},

	checkCell : function(column,line,nbLiberty)
	{

		var that = this;

		console.log(nbLiberty);
		// console.log(this.physicToVirtual(this));
		this.boardVirtual[column][line].checked = 1;

		console.log(this.boardVirtual[column][line].checked);


		if ( this.boardVirtual[column + 1][line].state == 0 && this.boardVirtual[column + 1][line].checked == 0 )
		{
			this.boardVirtual[column + 1][line].checked = 1;
			nbLiberty ++;
			console.log(nbLiberty + "add liberty");	
		}
			

		if ( this.boardVirtual[column - 1][line].state == 0 && this.boardVirtual[column - 1][line].checked == 0  )
		{
			this.boardVirtual[column - 1][line].checked = 1;	
			nbLiberty ++;
			console.log(nbLiberty + "add liberty");	
		}

		if ( this.boardVirtual[column][line + 1].state == 0 && this.boardVirtual[column][line + 1].checked == 0  )
		{
			this.boardVirtual[column][line + 1].checked = 1;	
			nbLiberty ++;
			console.log(nbLiberty + "add liberty");	
		}

		if ( this.boardVirtual[column][line - 1].state == 0 && this.boardVirtual[column][line - 1].checked == 0  )
		{
			this.boardVirtual[column][line - 1].checked = 1;	
			nbLiberty ++;
			console.log(nbLiberty + "add liberty");	
		}
		
		console.log(nbLiberty);

		if ( this.boardVirtual[column + 1][line].state == this.actualPlayer && (this.boardVirtual[column + 1][line].checked == 0))
		{
			console.log(nbLiberty + "récursif");
			return that.checkCell(column + 1,line,nbLiberty);
		}
		if ( this.boardVirtual[column - 1][line].state == this.actualPlayer && (this.boardVirtual[column - 1][line].checked == 0))
		{
			console.log(nbLiberty + "récursif");
			return that.checkCell(column - 1,line,nbLiberty);
		}
		if ( this.boardVirtual[column][line + 1].state == this.actualPlayer && (this.boardVirtual[column][line + 1].checked == 0))
		{
			console.log(nbLiberty + "récursif");
			return that.checkCell(column,line + 1,nbLiberty);
		}
		if ( this.boardVirtual[column][line - 1].state == this.actualPlayer && (this.boardVirtual[column][line - 1].checked == 0))
		{
			console.log(nbLiberty + "récursif");
			return that.checkCell(column,line - 1,nbLiberty);
		}

		return nbLiberty;
	},

	updateBoard : function(){

	},

	print : function(location)
	{
		var board = "<table class='board'>",
			that = this;

		for ( i = 1; i < that.boardVirtual.length - 1; i ++)
		{
			board += "<tr class='line'>";

			for ( j = 1; j < that.boardVirtual.length - 1; j ++)
			{
				board += "<td class='cell column-" + j + " line-" + i + "'></td>";
			}
			board += "</tr>";
		}
		board += "</table>";
		return $(location).html(board);
	},

	createPlayer : function(valuePlayer,name,colorPlayer)
	{
		this.player[valuePlayer] = {
			name : name,
			value : valuePlayer,
			color : colorPlayer,
			score : 0,
		};
	},
};

var board = new Board({ target : $(".containerGo") });