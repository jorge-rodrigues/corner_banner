/**
*
*   Plugin JQuery
*   Cria um corner banner em uma pagina HTML. Acrescenta a div page-peel-banner ao
*   body da pagina.
*
*   (Este plugin não permite sua aplicacao em mais de um elemento da pagina. Por isso
*   o metodo de definicao do plugin eh atribuido ao objeto JQuery com $.nomePlugin,
*   diferentemente dos outros plugins que atrigui o metodo a qualquer instancia do JQuery
*   como $.fn.nomePlugin, ou seja a qualquer elemento html.)
*
*   Autor: Jorge Rodrigues - Novembro/2014
*
*   Baseado no site http://fi-events.com.br/pt/
*
*   Opcoes:
*   pasta .........: string - pasta onde os arquivos do plugin estão instalados no site
*   bigImg ........: string - nome do arquivo da imagem grande banner exibido no over do mouser
*   smallImg ......: string - nome do arquivo da imagem pequena exibida no banner minimizado
*   bgImg .........: string - nome do arquivo da imagem que simula a dobra quando maximizado
*   peelOverlay ...: string - nome do arquivo da imagem que simula a dobra quando minimizado
*   url ...........: string - endereco para o link do banner
*   target ....... : strig - indica se a link deve abrir em nova aba '_self'

*
*   O plugin inseri um bloco HTML com na página.
*
*   <div id="#page-peel-banner">
*      <a href="[url]">
*         <img alt="" src="imagens/[bgImg]" style="width: 100px; height: 104px;">
*         <div class="peeloverlay" style="opacity: 0.452804; display: block;"></div>
*         <span class="page-peel-banner-img"></span>
*      </a>
*   </div>
*
*   Exemplo de uso:
*
*      $("document").ready( function() {
*         $.cornerBanner();             // o plugin foi atribuido ao objeto JQuery.
*      });
*/



/**
* Retorna a versao do IE
* @param [TIPO] [NOME] [DESCRICAO]
* @return [TIPO] [NOME] [DESCRICAO]
* @author [AUTOR]
*/
function msieversion() {

   var ua = window.navigator.userAgent
   var msie = ua.indexOf ( "MSIE " )

   if ( msie > 0 )      // If Internet Explorer, return version number
      return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )))
   else                 // If another browser, return 0
      return 0

}


var blinking = null;
var bannerOpened = false;
var isIE = ( navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ) ? true : false;  //$.browser.msie;
IEVersion = 9;


if(isIE){
   var IEVersion = msieversion(); // parseInt($.browser.version, 10);
}


if( isIE && IEVersion < 9 ){
   $(".peeloverlay").remove();
}else{
   function doBlink(){
      $(".peeloverlay").animate({opacity:0.8}, 300).animate({opacity:0.4}, 300);
      blinking = setTimeout("doBlink()", 600);
   }
}



/**
*       Criando o plugin (bloco principal)
*/
(function( $ ) {

   //**********************************
   //  DECLARACAO DO PLUGIN
   //**********************************

   $.cornerBanner = function(settings) {        //  O plugin esta sendo atrubuido ao objeto JQuery. Soh podera haver uma instancia.

      //----  Declarando um objeto interno com as propriedades do plugin.
      var config = {
        'url' : ''
        ,'target' : '_self'
        ,'pasta' : ''
        ,'bigImg' : 'Big.png'
        ,'smallImg' : 'Small.png'
        ,'bgImg' : 'bg.png'
        ,'peelOverlay' : 'peeloverlay.png'
      };


      //----  Deixe seu plugin o mais flexível e amigável possível para o usuário,
      //----  usando as opções. O método $.extend() pega dois ou mais objetos
      //----  como argumentos e une seus conteúdos dentro do primeiro objeto.
      //----  Nest caso pega o objeto config declarado acima e junta com o
      //----  objeto settings passado no argumento.
      if (settings) {
         $.extend(config, settings);
      }


      //----  O plugin esta sendo atribuido ao objeto JQuery.
      //----  Nao podera ser utilizado nos elementos html.
      //----  Eh aqui deve entrar o codigo executavel do plugin.

      //  Esta variavel serve apenas para precarregar a imagem
      var image1 = $('<img />').attr('src', config.pasta + 'imagens/' + config.bigImg);

      //----  DECLARANDO METODOS INTERNOS

      var openBanner = function(){
         if( !isIE || IEVersion > 8 ){
            $(".peeloverlay").hide();
         }
         $(".page-peel-banner-img").css('background-image', 'url(' + config.pasta + 'imagens/' + config.bigImg + ')');
         $("#page-peel-banner img")
            .stop()
            .animate({width: '500px', height: '520px'}, 800)
         ;
         $(".page-peel-banner-img")
            .stop()
            .animate({width: '500px', height: '500px'}, 800)
         ;
      }


      var closeBanner = function(){

         $("#page-peel-banner img")
            .stop()
            .animate({width: '100px', height: '104px'}, 800)
         ;

         $(".page-peel-banner-img")
            .stop()
            .animate({width: '100px', height: '100px'}, 800, function() {
               $(".page-peel-banner-img").css('background-image', 'url(' + config.pasta + 'imagens/' + config.smallImg + ')');
               if( !isIE || IEVersion > 8 ){
                  $(".peeloverlay").show();
               }
            })
         ;

         bannerOpened = false;

      }



      //----  Criando os elementos HTML
      //  div container
      //  <div id="[container]">
      var $div = $('<div />');
      $div.attr("id", 'page-peel-banner')
         .appendTo("body");
      ;
      //  tag ancora (link)
      //      <a href="[url]">
      var $link = $('<a />');
      $link.attr("href", config.url)
           .attr("target", config.target)
           .appendTo($div)
      ;
      //  tag img
      //         <img alt="" src="imagens/[bgImg]" style="width: 100px; height: 104px;">
      var $bg = $('<img />');
      $bg.attr("src", 'imagens/'+ config.bgImg)
         .appendTo($link)
      ;
      //  div com o efeito pisca-pisca
      //         <div class="peeloverlay" style="opacity: 0.452804; display: block;"></div>
      var $overlay = $('<div />');
      $overlay.attr('class', 'peeloverlay')
              .css('opacity', '0.5')
              .css('display', 'block')
              .css("background-image", 'url(' + config.pasta + 'imagens/peeloverlay.png)')
              .appendTo($link)
      ;
      //  elemento que contem as imagens do banner (minimizado e maximizado)
      //         <span class="page-peel-banner-img"></span>
      var $banner_img = $('<span />');
      $banner_img.attr('class', 'page-peel-banner-img')
              .css("background-image", 'url(' + config.pasta + 'imagens/' + config.smallImg + ')')
              .appendTo($link)
      ;


      if( isIE && IEVersion < 9 ){
         $(".peeloverlay").remove();
      }

      $('#page-peel-banner')
         .remove()
         .prependTo("body")
      ;

      if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.toLowerCase().indexOf("android") > -1) ) {

         var href = $("#page-peel-banner a").attr("href");

         $("#page-peel-banner a")
            .removeAttr("href")
            .attr("rel", href)
         ;

         $("#page-peel-banner a").click(function(){
            if(bannerOpened == false){
               openBanner();
               bannerOpened = true;
               $("#page-peel-banner a")
                  .removeAttr("rel")
                  .attr("href", href)
               ;
               setTimeout("closeBanner()", 5000);
               return false;
            }else{
               return true;
            }
         });

      } else {

         $('#page-peel-banner').hover(function(){
            openBanner();
         }, function(){
            closeBanner();
         });

      }

   };

})( jQuery );


$("document").ready( function() {

   if( !isIE || IEVersion > 8 ){
      doBlink();
   }

});
