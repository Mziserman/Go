var Board = function(target)
{
	this.init(target);
};

Board.prototype = 
{
	init : function(target)
	{
		this.main = target.target;
		this.boardVirtual = new Array();
		this.player = new Array();

		this.historic = new Array();
		this.hist_i = 0;

		this.createPlayer(1,"le dragon","white");
		this.createPlayer(2,"la tortue","black");
		this.actualPlayer = 1;
		this.enemiePlayer = 2;
		this.switchPlayerTurn();

		this.createBoard(6);
		this.boardPhysic = this.print(this.main,this.boardVirtual);
		this.cells = this.boardPhysic.find(".cell");

		var that = this;

		console.log(this.boardVirtual);

		this.cells.on("click",function()
		{
			var virtualCell = that.physicToVirtual(this);

			if ( ( virtualCell['value'] == 0 || virtualCell['value'] == that.player[that.actualPlayer].captureValue ) && that.checkCell(virtualCell['column'],virtualCell['line'],0,that.player[that.actualPlayer]) > 0 )
			{
				that.placingCell(this,virtualCell['column'],virtualCell['line']);
				that.updateBoard(virtualCell['column'],virtualCell['line'],0,0);
			}
			else if ( virtualCell['value'] == that.player[that.enemiePlayer].captureValue && that.updateBoard(virtualCell['column'],virtualCell['line'],1,0) == 1 )
			{
				that.placingCell(this,virtualCell['column'],virtualCell['line']);
				that.updateBoard(virtualCell['column'],virtualCell['line'],0,0);
				that.historic[that.hist_i] = that.boardVirtual;
				that.hist_i ++;
			}

				
		});


	},

	switchPlayerTurn : function()
	{
		this.actualPlayer += this.enemiePlayer;
		this.enemiePlayer = this.actualPlayer - this.enemiePlayer;
		this.actualPlayer -= this.enemiePlayer;
	},

	physicToVirtual : function(cell)
	{
		var virtual = new Array();

		virtual['column'] = Number($(cell).attr("class").substring($(cell).attr("class").lastIndexOf('column-') + 7,$(cell).attr("class").lastIndexOf('column-') + 8));
		virtual['line'] = Number($(cell).attr("class").substring($(cell).attr("class").lastIndexOf('line-') + 5,$(cell).attr("class").lastIndexOf('line-') + 6));
		virtual['value'] = this.boardVirtual[virtual['column']][virtual['line']].state;

		return virtual;
	},

	virtualToPhysic : function(column,line)
	{
		var physic;
		physic = $('.cell.column-'+ column +'.line-'+ line);
		return physic;
	},

	createBoard : function(size)
	{
		var that = this;

		for ( i = 0; i < size + 2; i ++)
		{
			that.boardVirtual[i] = new Array();
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

	placingCell : function(cell,column,line)
	{
		this.boardVirtual[column][line].state = this.player[this.actualPlayer].value;
		$(cell).addClass(this.player[this.actualPlayer].color);
	},

	captureCell : function(column,line)
	{
		console.log("CAPUTRE!!!!");
		var cell = this.virtualToPhysic(column,line);
		console.log(cell);
		this.boardVirtual[column][line].state = this.player[this.actualPlayer].captureValue;
		$(cell).removeClass(this.player[this.enemiePlayer].color);
	},

	clearChecked : function(board)
	{
		var that = this;
		for ( i = 0; i < board.length; i ++)
		{
			for ( j = 0; j < board[i].length; j ++)
			{
				board[i][j].checked = 0;
			}
		}
	},

	checkCell : function(column,line,nbLiberty,player)
	{
		console.log(player.value);
		console.log(player.captureValue);
		console.log(player);
		var that = this;

		this.boardVirtual[column][line].checked = 1;

		if ( ( this.boardVirtual[column + 1][line].state == 0 || this.boardVirtual[column + 1][line].state == player.captureValue ) && this.boardVirtual[column + 1][line].checked == 0 )
		{
			this.boardVirtual[column + 1][line].checked = 1;
			nbLiberty ++;
		}
			

		if ( ( this.boardVirtual[column - 1][line].state == 0 || this.boardVirtual[column - 1][line].state == player.captureValue ) && this.boardVirtual[column - 1][line].checked == 0  )
		{
			this.boardVirtual[column - 1][line].checked = 1;	
			nbLiberty ++;	
		}

		if ( ( this.boardVirtual[column][line + 1].state == 0 || this.boardVirtual[column][line + 1].state == player.captureValue ) && this.boardVirtual[column][line + 1].checked == 0  )
		{
			this.boardVirtual[column][line + 1].checked = 1;	
			nbLiberty ++;	
		}

		if ( ( this.boardVirtual[column][line - 1].state == 0 || this.boardVirtual[column][line - 1].state == player.captureValue ) && this.boardVirtual[column][line - 1].checked == 0  )
		{
			this.boardVirtual[column][line - 1].checked = 1;	
			nbLiberty ++;
		}
		
		if ( this.boardVirtual[column + 1][line].state == player.value  && (this.boardVirtual[column + 1][line].checked == 0))
		{
			return that.checkCell(column + 1,line,nbLiberty,player);
		}
		if ( this.boardVirtual[column - 1][line].state == player.value  && (this.boardVirtual[column - 1][line].checked == 0))
		{
			return that.checkCell(column - 1,line,nbLiberty,player);
		}
		if ( this.boardVirtual[column][line + 1].state == player.value  && (this.boardVirtual[column][line + 1].checked == 0))
		{
			return that.checkCell(column,line + 1,nbLiberty,player);
		}
		if ( this.boardVirtual[column][line - 1].state == player.value  && (this.boardVirtual[column][line - 1].checked == 0))
		{
			return that.checkCell(column,line - 1,nbLiberty,player);
		}
		this.clearChecked(this.boardVirtual);
		return nbLiberty;
	},

	updateBoard : function(column,line,testOrNo,capture){

		if ( this.boardVirtual[column + 1][line].state == this.player[this.enemiePlayer].value)
		{
			console.log("upadte board" + this.checkCell(column + 1,line,0,this.player[this.enemiePlayer]));
			if ( this.checkCell(column + 1,line,0,this.player[this.enemiePlayer]) == 0 )
			{	
				if ( testOrNo == 0 )
				{
					console.log("capture launch");
					this.captureCell(column + 1,line);
				}
				else
				{
					console.log("variable = 1 ");
					capture = 1;
				}
				return this.updateBoard(column + 1, line,testOrNo,capture);
			}
		}
			

		if ( this.boardVirtual[column - 1][line].state == this.player[this.enemiePlayer].value)
		{
			console.log("upadte board" +this.checkCell(column - 1,line,0,this.player[this.enemiePlayer]));
			if ( this.checkCell(column - 1,line,0,this.player[this.enemiePlayer]) == 0 )
			{	
				if ( testOrNo == 0 )
				{
					console.log("capture launch");
					this.captureCell(column - 1,line);
				}
				else
				{
					console.log("variable = 1 ");
					capture = 1;
				}
				return this.updateBoard(column - 1, line,testOrNo,capture);
			}	
		}

		if ( this.boardVirtual[column][line + 1].state == this.player[this.enemiePlayer].value)
		{
			console.log("upadte board" +this.checkCell(column,line + 1,0,this.player[this.enemiePlayer]));
			if ( this.checkCell(column,line + 1,0,this.player[this.enemiePlayer]) == 0 )
			{
				if ( testOrNo == 0 )
				{
					console.log("capture launch");
					this.captureCell(column,line + 1);
				}
				else
				{
					console.log("variable = 1 ");
					capture = 1;
				}
				return this.updateBoard(column, line + 1,testOrNo,capture);
			}
		}

		if ( this.boardVirtual[column][line - 1].state == this.player[this.enemiePlayer].value)
		{
			console.log("upadte board" +this.checkCell(column,line - 1,0,this.player[this.enemiePlayer]));
			if ( this.checkCell(column,line - 1,0,this.player[this.enemiePlayer]) == 0 )
			{			
				if ( testOrNo == 0 )
				{
					console.log("capture launch");
					this.captureCell(column,line - 1);
				}
				else
				{
					console.log("variable = 1 ");
					capture = 1;
				}
				return this.updateBoard(column,line - 1,testOrNo,capture);
			}
		}

		return	capture;
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
			captureValue : valuePlayer + 2,
			color : colorPlayer,
			score : 0,
		};
	},
};

var board = new Board({ target : $(".containerGo") });