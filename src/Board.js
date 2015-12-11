// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        //console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        // console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        // console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //console.log("-------------------", this.get(rowIndex)[0]);
      //debugger;
      var conflicts = 0;

      for (var i = 0; i < rowIndex.length; i++){
        if(rowIndex[i] === 1){
          conflicts++;
        }
      }
        //console.log("rowIndex", rowIndex, " conflicts", conflicts);
      if (conflicts > 1) {
          return true;
      } else {
          return false; // fixme
      }
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // console.log("Calling this function");
      //console.log("\n\nthis", this.attributes[0]);
      var hasRowConflict = false;
      for (var row in this.attributes){
        // this.hasRowConflictAt(this.attributes[i]);
        // console.log(this.attributes[key]);
        if (this.hasRowConflictAt(this.attributes[row])) {

          hasRowConflict = true;
        }
      }
        return hasRowConflict;
      // return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      this.printTheBoard();
      // debugger;
      // colIndex is expected to be array of Columns Values
      var conflicts = 0;
      var matrix = this.attributes;

      for (var i = 0; i < matrix.n; i++){
        
        if (matrix[i][colIndex] === 1){
          conflicts++;
        }
      }

      if (conflicts > 1) {
          return true;
      } else {
          return false; // fixme
      }

    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var matrix = this.attributes;

      for (var i = 0; i < matrix.n; i++){
        if (this.hasColConflictAt(i)){
          return true;
        }
      }
      return false;
    },

    



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
       var conflicts = 0;
       var matrix = this.attributes;
       var colIndex = majorDiagonalColumnIndexAtFirstRow;
       // var i = majorDiagonalColumnIndexAtFirstRow;
       this.printTheBoard();

       // debugger;
      for (var row = 0; row < matrix.n; row++) {
        
        // if(colIndex <= 0 ){
          
          for (var column = colIndex; ((column <= colIndex+1) && (column < matrix.n)); column++) {
                      
            if (matrix[row][column] === 1) {
              conflicts++;
            }
            console.log(matrix[row][column], " row:" , row, " column: ",column);
          }
        
          colIndex++;
      }


        //console.log(matrix[row][column]);
      
        // Hard Major
        // Iterate through the bottom left area of the board
        // Here Row is less than the Column 
        // We need to decrease Column by colIndex by 1


      if (conflicts > 1) {
        return true
      }

      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      
      var matrix = this.attributes;  

      for (var column = -matrix.n; column < matrix.n; column++) {
        if (this.hasMajorDiagonalConflictAt(column)){
          return true;
        }
      }

      return false;

    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
       var conflicts = 0;
       var matrix = this.attributes;
       var colIndex = minorDiagonalColumnIndexAtFirstRow;
       // var i = majorDiagonalColumnIndexAtFirstRow;
       this.printTheBoard();

       // debugger;
      for (var row = 0; row < matrix.n; row++) {
        
        // if(colIndex <= 0 ){
          for (var column = colIndex; ((column >= colIndex-1)); column--) {
          // debugger;
                      
            if (matrix[row][column] === 1) {
              conflicts++;
            }
            console.log(matrix[row][column], " row:" , row, " column: ",column);
          }
        
          colIndex--;
      }

      
        //console.log(matrix[row][column]);
      
        // Hard Major
        // Iterate through the bottom left area of the board
        // Here Row is less than the Column 
        // We need to decrease Column by colIndex by 1


      if (conflicts > 1) {
        return true
      }

      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      
      var matrix = this.attributes;  

      for (var column = (2*matrix.n-1); column >= 0; column--) {
        if (this.hasMinorDiagonalConflictAt(column)){
          return true;
        }
      }

      return false;
    },

    printTheBoard: function(){
      console.log("\n-----------------------------");
      for (var i = 0; i < this.attributes.n; i++) {

        console.log(this.attributes[i]);  
      };
      console.log("\n-----------------------------");

    }
    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
