Ext.define("PSI.UX.ExcelPanel", {
		extend : "Ext.Panel",
		dso : null,
		store : null,
		xls : null,
		zoom : 100,
		available : false,
		html : "<object classid='clsid:00460182-9E5E-11d5-B7C8-B8269041DD57' id='dso' CODEBASE='cab/dsoframer.cab#version=2,0,0,0'>"
		+ "<PARAM NAME='_ExtentX' VALUE='16960'>	"
		+ "<PARAM NAME='_ExtentY' VALUE='13600'>	"
		+ "<PARAM NAME='BorderColor' VALUE='-2147483632'>	"
		+ "<PARAM NAME='BackColor' VALUE='-2147483643'>	"
		+ "<PARAM NAME='ForeColor' VALUE='-2147483640'>	"
		+ "<PARAM NAME='TitlebarColor' VALUE='-2147483635'>	"
		+ "<PARAM NAME='TitlebarTextColor' VALUE='-2147483634'>	"
		+ "<PARAM NAME='BorderStyle' VALUE='0'>	"
		+ "<PARAM NAME='Titlebar' VALUE='0'>	"
		+ "<PARAM NAME='Toolbars' VALUE='0'>	"
		+ "<PARAM NAME='Menubar' VALUE='0'>" + "</OBJECT>",
		initComponent : function(){
			Ext.ux.ExcelPanel.superclass.initComponent.call(this);
			this.addEvents(
				'afterrender'
			);
		},
		afterRender : function(){
			Ext.ux.ExcelPanel.superclass.afterRender.call(this); // do sizing calcs last

			if(typeof(dso) == 'undefined')
				this.dso = document.getElementById("dso");
			else
				this.dso = dso;

			if(!dso)
			{
				alert( "加载DsoFramer出错，请先注册组件.");
			}else
			{
				dso.width = this.getInnerWidth();
				dso.height = this.getInnerHeight();

				this.on("resize",function(ep){
					dso.width = ep.getInnerWidth();
					dso.height = ep.getInnerHeight();
				});
			}
			this.fireEvent("afterrender", this);

			if(this.dso)
			{
				if(this.xls)
				{
					this.open(this.xls);
				}
				else
				{
					this.create();
					if(this.store)
					{
						if(!this.store.data)
						{

						}
					}
				}
			}
		},
		open : function(filename)
		{
			try{
				this.dso.Open(filename);
				this.dso.ActiveDocument.Application.CommandBars("Web").Visible = false;
				this.available = true;
			}catch(e)
			{
				alert( "打开文件出错." + "["+ this.xls +"]:" + e.description);
			}
		},
		close : function()
		{
			try{
				this.dso.Close();
				this.available = false;
			}catch(e)
			{
				alert( "关闭Excel出错."  + e.description);
			}
		},
		create : function()
		{
			try{
				this.dso.CreateNew("Excel.Sheet");
				this.dso.ActiveDocument.Application.CommandBars("Web").Visible = false;
				this.available = true;
			}catch(e)
			{
				alert( "创建新Excel出错."  + e.description);
			}
		},
		save : function()
		{
			this.saveAs(this.xls);
		},
		saveAs : function(filename)
		{
			try{
				this.dso.Save(filename,true);
			}catch(e)
			{
				alert( "保存Excel出错."  + e.description);
			}
		},
		saveCopy : function()
		{
			try{
				this.dso.ShowDialog(3);
			}catch(e)
			{
				alert( "保存Excel出错."  + e.description);
			}
		},
		print : function()  //PrintOut(true);
		{
			try{
				this.dso.PrintOut(true);
			}catch(e)
			{
				alert( "打印Excel出错."  + e.description);
			}
		},
		preview : function() //PrintPreview();
		{
			try{
				this.dso.PrintPreview();
			}catch(e)
			{
				alert( "打印预览Excel出错."  + e.description);
			}
		},
		zoomin : function() //PrintPreview();
		{
			try{
				if (this.zoom < 500) {
					this.zoom = Math.round(this.zoom * 1.2);
					this.dso.ActiveDocument.Application.ActiveWindow.Zoom = this.zoom;
				}
			}catch(e)
			{
				alert( "放大Excel出错."  + e.description);
			}
		},
		zoomout : function() //PrintPreview();
		{
			try{
				if (this.zoom > 20) {
					this.zoom = Math.round(this.zoom / 1.2);
					this.dso.ActiveDocument.Application.ActiveWindow.Zoom = this.zoom;
				}
			}catch(e)
			{
				alert( "缩小Excel出错."  + e.description);
			}
		},
		setCellValue : function(row,col,value)
		{
			try{
				this.dso.ActiveDocument.ActiveSheet.Cells(row,col) = value;
			}catch(e)
			{
				alert( "Excel赋值出错." + "["+ row +"," +col +"]=" + value+ "\r\n" +e.description);
			}
		},
		getCellValue : function(row,col)
		{
			try{
				return this.dso.ActiveDocument.ActiveSheet.Cells(row,col).Value;
			}catch(e)
			{
				alert( "Excel取值出错." + "["+ row +"," +col +"]" +e.description);
			}
		},

			/*************************************************
			 from GridView
			 *************************************************/

			// private

			initData : function(ds, cm){
				if(this.ds){
					this.ds.un("load", this.onLoad, this);
					this.ds.un("datachanged", this.onDataChange, this);
					this.ds.un("add", this.onAdd, this);
					this.ds.un("remove", this.onRemove, this);
					this.ds.un("update", this.onUpdate, this);
					this.ds.un("clear", this.onClear, this);
				}
				if(ds){
					ds.on("load", this.onLoad, this);
					ds.on("datachanged", this.onDataChange, this);
					ds.on("add", this.onAdd, this);
					ds.on("remove", this.onRemove, this);
					ds.on("update", this.onUpdate, this);
					ds.on("clear", this.onClear, this);
				}
				this.ds = ds;

	//        if(this.cm){
	//            this.cm.un("configchange", this.onColConfigChange, this);
	//            this.cm.un("widthchange", this.onColWidthChange, this);
	//            this.cm.un("headerchange", this.onHeaderChange, this);
	//            this.cm.un("hiddenchange", this.onHiddenChange, this);
	//            this.cm.un("columnmoved", this.onColumnMove, this);
	//            this.cm.un("columnlockchange", this.onColumnLock, this);
	//        }
	//        if(cm){
	//            cm.on("configchange", this.onColConfigChange, this);
	//            cm.on("widthchange", this.onColWidthChange, this);
	//            cm.on("headerchange", this.onHeaderChange, this);
	//            cm.on("hiddenchange", this.onHiddenChange, this);
	//            cm.on("columnmoved", this.onColumnMove, this);
	//            cm.on("columnlockchange", this.onColumnLock, this);
	//        }
				this.cm = cm;
			},

			// private
			onDataChange : function(){
				this.refresh();
				//this.updateHeaderSortState();
			},

			// private
			onClear : function(){
				this.refresh();
			},

			// private
			onUpdate : function(ds, record){
				this.refreshRow(record);
			},

			// private
			onAdd : function(ds, records, index){
				this.insertRows(ds, index, index + (records.length-1));
			},

			// private
			onRemove : function(ds, record, index, isUpdate){
	//        if(isUpdate !== true){
	//            this.fireEvent("beforerowremoved", this, index, record);
	//        }
	//        this.removeRow(index);
	//        if(isUpdate !== true){
	//            this.processRows(index);
	//            this.applyEmptyText();
	//            this.fireEvent("rowremoved", this, index, record);
	//        }
			},

			// private
			onLoad : function(){
				//this.scrollToTop();

			},

	//    // private
	//    onColWidthChange : function(cm, col, width){
	//        this.updateColumnWidth(col, width);
	//    },

	//    // private
	//    onHeaderChange : function(cm, col, text){
	//        this.updateHeaders();
	//    },

	//    // private
	//    onHiddenChange : function(cm, col, hidden){
	//        this.updateColumnHidden(col, hidden);
	//    },

	//    // private
	//    onColumnMove : function(cm, oldIndex, newIndex){
	//        this.indexMap = null;
	//        var s = this.getScrollState();
	//        this.refresh(true);
	//        this.restoreScroll(s);
	//        this.afterMove(newIndex);
	//    },

	//    // private
	//    onColConfigChange : function(){
	//        delete this.lastViewWidth;
	//        this.indexMap = null;
	//        this.refresh(true);
	//    }


			refresh : function()
			{

			},

			refreshRow : function(r)
			{

			},

			insertRows : function(ds, index, end){

			}
	});