<?xml version="1.0"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns="http://www.w3.org/1999/xhtml">
    <xsl:output method="text"/>
<!-- this transform is designed to translate xar-formatted xwiki articles into hairball output files -->

    <xsl:template match="/">/ARTICLE" <xsl:value-of select="xwikidoc/title"/> "/
/WEB <xsl:value-of select="xwikidoc/web"/> WEB/
/PARENT /ARTICLEREF 
	/REFNAME <xsl:value-of select="replace(xwikidoc/parent, '(\w*)\.(\w*)', '../$1/$2.html')"/> REFNAME/ 
	/REFTEXT <xsl:value-of select="xwikidoc/parent"/> REFTEXT/
ARTICLEREF/ PARENT/
<xsl:apply-templates select='xwikidoc/content' mode='normal'/>
ARTICLE/<xsl:apply-templates select="xwikidoc/attachment"/></xsl:template>
    
    <xsl:template match="@*|node()">
        <xsl:result-document href="{filename}.base64">
            <xsl:value-of select='content'/>
        </xsl:result-document>
    </xsl:template>
    
    <xsl:template match="@*|node()" mode='normal'>
        <xsl:variable name="pass1">
            <xsl:apply-templates mode="regex7"/>
        </xsl:variable>
        <xsl:variable name="pass2">
            <xsl:apply-templates mode="regex5" select="$pass1"/>
        </xsl:variable>
        <xsl:variable name="pass3">
            <xsl:apply-templates mode="regex6" select="$pass2"/>
        </xsl:variable>
        <xsl:variable name="pass4">
            <xsl:apply-templates mode="regex4" select="$pass3"/>
        </xsl:variable>
        <xsl:variable name="pass5">
            <xsl:apply-templates mode="regex3" select="$pass4"/>
        </xsl:variable>
        <xsl:variable name="pass6">
            <xsl:apply-templates mode="regex2" select="$pass5"/>
        </xsl:variable>
        <xsl:variable name="pass7">
            <xsl:apply-templates mode="regex1" select="$pass6"/>
        </xsl:variable>
        <xsl:variable name="pass8">
            <xsl:apply-templates mode="regex8" select="$pass7"/>
        </xsl:variable>
        <xsl:variable name="pass9">
            <xsl:apply-templates mode="regex9" select="$pass8"/>
        </xsl:variable>
        <xsl:variable name="pass10">
            <xsl:apply-templates mode="regex10" select="$pass9"/>
        </xsl:variable>
        <xsl:variable name="pass11">
            <xsl:apply-templates mode="regex11" select="$pass10"/>
        </xsl:variable>
        <xsl:variable name="pass12">
            <xsl:apply-templates mode="regex12" select="$pass11"/>
        </xsl:variable>
        <xsl:variable name="pass13">
            <xsl:apply-templates mode="regex13" select="$pass12"/>
        </xsl:variable>
        <xsl:variable name="pass14">
            <xsl:apply-templates mode="regex14" select="$pass13"/>
        </xsl:variable>
        <xsl:variable name="pass15">
            <xsl:apply-templates mode="regex15" select="$pass14"/>
        </xsl:variable>
        <xsl:variable name="pass16">
            <xsl:apply-templates mode="regex16" select="$pass15"/>
        </xsl:variable>
        <xsl:variable name="pass17">
            <xsl:apply-templates mode="regex17" select="$pass16"/>
        </xsl:variable>
        <xsl:variable name="pass18">
            <xsl:apply-templates mode="regex18" select="$pass17"/>
        </xsl:variable>
        <xsl:variable name="pass19">
            <xsl:apply-templates mode="regex19" select="$pass18"/>
        </xsl:variable>
        <xsl:variable name="pass20">
            <xsl:apply-templates mode="regex20" select="$pass19"/>
        </xsl:variable>
        <xsl:variable name="pass21">
            <xsl:apply-templates mode="regex21" select="$pass20"/>
        </xsl:variable>
            
        <xsl:value-of select="$pass21"/>
    </xsl:template>
    
    <xsl:template match="@*|node()" mode="regex1">
        <xsl:value-of select="replace(., '\n== (.*?) ==', '/SECTION $1 SECTION/ ')"/>
    </xsl:template>
    
    <xsl:template match="@*|node()" mode='regex2'>
        <xsl:value-of select="replace(., '\n=== (.*?) ===', '/SUBSECTION $1 SUBSECTION/ ')"/>
    </xsl:template>

    <xsl:template match="@*|node()" mode='regex3'>
        <xsl:value-of select="replace(., '\[\[image:(.*?)\|\|style=&quot;float: right;(.*?)&quot;\]\]', '/RIGHT /IMAGE $1 IMAGE/ RIGHT/ ')"/>
    </xsl:template>

    <xsl:template match="@*|node()" mode='regex4'>
        <xsl:value-of select="replace(., '\[\[(.*?)>>(.*?)\]\]', '$1')"/>
    </xsl:template>

    <xsl:template match="@*|node()" mode='regex5'>
        <xsl:value-of select="replace(., '\*\*(.*?)\*\*', '/EM $1 EM/')"/>
    </xsl:template>
    
<xsl:variable name="newline"><xsl:text>
</xsl:text></xsl:variable>

    <xsl:template match="@*|node()" mode='regex6'>
        <xsl:value-of select="replace(., '^\*(.*?)$', '/LI $1 LI/','m')"/>
    </xsl:template>

    <xsl:template match="@*|node()" mode='regex7'>
        <xsl:value-of select="replace(., '\[\[([^\[]*?)>>(doc:)*(.*?)\]\]', '/ARTICLEREF /REFNAME $3 REFNAME/ /REFTEXT $1 REFTEXT/ ARTICLEREF/ ')"/>
    </xsl:template>

    <xsl:template match="@*|node()" mode='regex8'>
        <xsl:value-of select="replace(., '((\n/LI(.*?)LI/)+)', '/UL $1 UL/')"/>
    </xsl:template>
    
    <xsl:template match="@*|node()" mode='regex9'>
        <xsl:value-of select="replace(., '/REFNAME (\w+?)\.(\w+?) REFNAME/', '/REFNAME ../$1/$2.html REFNAME/ ')"/>
    </xsl:template>
    
    <xsl:template match="@*|node()" mode="regex10">
        <xsl:value-of select="replace(., '= (.*?) =$', '/CHAPTER $1 CHAPTER/','m')"/>
    </xsl:template>

    <xsl:template match="@*|node()" mode='regex11'>
        <xsl:value-of select="replace(., '^\|(.*?)$', '/TR |$1 TR/','m')"/>
    </xsl:template>
    
    <xsl:template match="@*|node()" mode='regex12'>
        <xsl:value-of select="replace(., '((\n/TR(.*?)TR/)+)', '/TABLE $1 TABLE/')"/>
    </xsl:template>

    <xsl:template match="@*|node()" mode='regex13'>
        <xsl:value-of select="replace(., '/TR \|=(.*?) TR/', '/TR /TH $1 TH/ TR/')"/>
    </xsl:template>
    
    <xsl:template match="@*|node()" mode='regex14'>
        <xsl:value-of select="replace(., '\|=(.*?)', ' /TH/ $1')"/>
    </xsl:template>

    <xsl:template match="@*|node()" mode='regex15'>
        <xsl:value-of select="replace(., '\|(.*?) TR/', ' /TD $1 TD/ TR/')"/>
    </xsl:template>
    
    <xsl:template match="@*|node()" mode='regex16'>
        <xsl:value-of select="replace(., '\|', ' /TD/ ')"/>
    </xsl:template>

    <xsl:template match="@*|node()" mode="regex17">
        <xsl:value-of select="replace(., '== (.*?) ==', '/SECTION $1 SECTION/ ')"/>
    </xsl:template>
    
    <xsl:template match="@*|node()" mode='regex18'>
        <xsl:value-of select="replace(., '=== (.*?) ===', '/SUBSECTION $1 SUBSECTION/ ')"/>
    </xsl:template>

    <xsl:template match="@*|node()" mode='regex19'>
        <xsl:value-of select="replace(., '\{\{(.*?)\}\}', ' ')"/>
    </xsl:template>

    <xsl:template match="@*|node()" mode='regex20'>
        <xsl:value-of select="replace(., '//&quot;(.*?)&quot;//', ' /QUOTE $1 QUOTE/ ')"/>
    </xsl:template>
    
    <xsl:template match="@*|node()" mode='regex21'>
        <xsl:value-of select="replace(., '/REFNAME (\w+?) REFNAME/', '/REFNAME ./$1.html REFNAME/ ')"/>
    </xsl:template>    
</xsl:stylesheet>
