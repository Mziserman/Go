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

		this.create(6);
		this.boardPhysic = this.print(this.main,this.boardVirtual);
		this.cell = this.boardPhysic.find(".cell");

		var that = this;

		this.cell.on("click",function()
		{
			var virtualCell = that.physicToVirtual(this);

			if ( virtualCell == 0 && that.checkCell(virtualCell['column'],virtualCell['line'],virtualCell['column'],virtualCell['line']) == true )
				that.changeValueCell(this,virtualCell['column'],virtualCell['line']);
		});


	},

	physicToVirtual : function(cell)
	{
		var virtual = new Array;

		virtual['column'] = Number($(cell).attr("class").substring($(cell).attr("class").lastIndexOf('column-') + 7,$(cell).attr("class").lastIndexOf('column-') + 8));
		virtual['line'] = Number($(cell).attr("class").substring($(cell).attr("class").lastIndexOf('line-') + 5,$(cell).attr("class").lastIndexOf('line-') + 6));

		return virtual;
	},

	create : function(size)
	{
		var that = this;

		for ( i = 0; i < size + 2; i ++)
		{
			that.boardVirtual[i] = new Array;
			for ( j = 0; j < size + 2; j ++)
			{
				
				that.boardVirtual[i][j] = 0;
			}
		}
	},

	changeValueCell : function(cell,column,line)
	{

		this.boardVirtual[column][line] = this.actualPlayer;
		$(cell).addClass(this.player[this.actualPlayer].color);
	},

	checkCell : function(column,line,columnHist,lineHist)
	{

		var that = this;

		if ( ( this.boardVirtual[column + 1][line] == 0 && ( (column + 1) != columnHist || line != lineHist ) ) || ( this.boardVirtual[column - 1][line] == 0 && ( (column - 1) != columnHist || line != lineHist ) ) || ( this.boardVirtual[column][line + 1] == 0 && ( column != columnHist || (line + 1) != lineHist ) ) || ( this.boardVirtual[column][line - 1] == 0 && ( column != columnHist || (line - 1) != lineHist ) ) )
		{
			return true	
		}

		if ( this.boardVirtual[column + 1][line] == this.actualPlayer )
		{
			return that.checkCell(column + 1,line,columnHist,lineHist);
		}
		if ( this.boardVirtual[column - 1][line] == this.actualPlayer )
		{
			return that.checkCell(column - 1,line,columnHist,lineHist);
		}
		if ( this.boardVirtual[column][line + 1] == this.actualPlayer )
		{
			return that.checkCell(column,line + 1,columnHist,lineHist);
		}
		if ( this.boardVirtual[column][line - 1] == this.actualPlayer )
		{
			return that.checkCell(column,line - 1,columnHist,lineHist);
		}

		return false;
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
			color : colorPlayer,
			score : 0,
		};
	},
};

var board = new Board({ target : $(".containerGo") });