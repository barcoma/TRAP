<template>
  <v-container >

    <v-layout align-center row wrap class="top-area">

      <v-flex xs3 mt-3>
         <v-icon large color="white">menu</v-icon>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs4 mt-3 class="flex-avatar">
        <v-avatar
          :size="64"
          color="grey lighten-4"
        >
          <img src="https://i1.rgstatic.net/ii/profile.image/390911189110788-1470211898704_Q512/Wolfgang_Taube2.jpg" alt="avatar">
        </v-avatar>
      </v-flex>
      <v-flex class="text-xs-left" xs12 offset-xs1>
        <h1>Hi, Wolfang!</h1>
        <h3>Wo soll deine Reise hingehen?</h3>
      </v-flex>

     <v-layout mt-0 mb-0 align-center class="location">
      <v-flex class="text-xs-left" xs1 offset-xs1>
        <v-icon medium>location_on</v-icon>
      </v-flex>

      <v-flex class="text-xs-left" xs10>
        <p>Wilhemstraße 22</p>
        <p>Furtwangen im Schwarzwald</p>
      </v-flex>
     </v-layout>

      <v-flex mt-1 xs10 offset-xs1>
            <v-text-field 
            class="main-input"
            id="testFeld"
            label="Solo"
            placeholder="Los geht's!"
            solo
            v-model="searchTerm"
          >
            <template slot="append">
                <v-icon v-on:click="locationSearch()">check</v-icon>
                <v-icon>directions</v-icon>
            </template>
          </v-text-field>
          
      </v-flex>

    </v-layout>

    <v-layout row>
      <div>
        <v-tabs
          v-model="active"
          color="white"
          light
          centered
          grow
          active-class="active-tab"
        >
          <v-tab href="#tab-1">
            Letzte Ziele
          </v-tab>
          <v-tab href="#tab-2">
            Favoriten
          </v-tab>
          <v-tab href="#tab-3">
            Entdecken
          </v-tab>
          <v-tab-item
                v-for="i in 3"
                :key="i"
                :value="'tab-' + i"
                touchless
                lazy
          >

            <carousel v-if="i == 1"
            :paginationEnabled="false"
            >
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="https://images.unsplash.com/photo-1436637706755-81d219b36e29?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Eifelturm</div>
                        <div class="carousel-tex-subheader">Paris, France</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="https://images.unsplash.com/photo-1486247496048-cc4ed929f7cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Louvre</div>
                        <div class="carousel-tex-subheader">Paris, France</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="https://picsum.photos/510/300?random"
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Wolfang</div>
                        <div class="carousel-tex-subheader">Paris, France</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
            </carousel>




            <carousel v-if="i == 2"
            :paginationEnabled="false"
            >
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="https://www.schwarzwald-geniessen.de/eip/clips/lightbox_eingang.jpg?fl=18139758"
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Uhrenmuseum</div>
                        <div class="carousel-tex-subheader">Furtwangen, Germany</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhMSExMWFhUXGR8XGRcYFxsaGhgbGhoYGhgdHiAdHSggGxolHRoYITEhJSkrLi4vFx8zODMsNygtLisBCgoKDg0OGxAQGi0lICUuLS0vLS0tLS0tLy0vLS0tLy0tMC0tLy0tLS8tLTUtLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMoA+QMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAEBQIDBgcBAAj/xABFEAACAQIEAwQGBwcDBAEFAQABAhEDIQAEEjEFQVEGEyJhMnGBkaGxFEJSksHR8AcVI2JyguFTsvEzosLSQxckNGOTFv/EABoBAAMBAQEBAAAAAAAAAAAAAAECAwAEBQb/xAAuEQACAgEDAQYFBQEBAAAAAAAAAQIRIQMSMUEEE1FhcfAigZGhwRQysdHh8QX/2gAMAwEAAhEDEQA/AOtZysNDBdypgjkYMY5a3FXdSzUqTx9dqKypNvSUAgm/PGqrcV0ozExCk+4Yz/AGpGhSosC2pA5gMQxJDMfDuRAEcu68zjl14ttJPxPW/wDOemoTepDdldPWxNkKNAArVRjIiab6SN59INvPwxreyPBqDF2yzOukKGWoq85iCp8jyxRTy6AAUFpaWILl5Y6JBAAYHdJMSPS9WDOxGaAzecQIqKioIViw3MX64npQakrK9p0ezS0pz0o01nnzSyvmNc5wF2EFVYev88R4Zw5aFhS0+YX8cU9ve01fLrl6OVUNmMxU0JNwAILGDbmovtJPLAydqc5Q+iU83Qp97WzBoEqfCRpVkdYnmSpHlyx2OCPF3GnWqMXrWGMPw/8AaWlSqMvWyGYp1TAKQGgkSJ1aSJ5WvjQ5DjORzC5dkePpOruhDBjo9MED0SPPGo1oYcQqfwnjfSY92FPBq5ZWBMxe/Q4a1cnTYtTFXxASV1AkA7EjePPAOQ4C9GdLhxpi4K7eqcFJgdBGDKPoj1YQ5lM/qQLSphNY1EPqOjnvpv7Dh7ceQxmzJHrU5wJmctTIINxz3OLKmaFxJPX9fhj5a2qwMW2tJHl0wowi4twmhU0kiCCLgR7j68YvN9mAC5YuGUWYQSwMsJAn1CRsseWOnMRsCPbt7cJqlAO9SlqZbSrA72k7jlHxwkkuQpnJlXuXbUXZAStxKQ1xaJ31c+YxJ+MmiSgVSkSCCAJm02EXWY8/LG545wqn3RR7uq+kTEiY2E/LGMqZRCyr3dtM3cEbbTNwPEMQnppvIGrKRnWdu7pykHX/ACkNBiekm5icVVazoqPAa51JqBkeIbjYbbdB0x7mc6xB0mO7MSJBiLbnb1csQr5sAioVJc2MbxNv+f8AOJbX4CuzwcVV7U9GoyLmHFusyNutt8MKNRxoLp4dOkxc29XOw93PC/N1VVzUOhte3OOV+hvHqGCaLCpDU2KsBeI0GDsQTbrIm5OFmsYQGE/RE195SImJZLHUDubjffbDrhhVHpQY0ONSnkbn2f5xkslSrK6uI52mCQWs1yCIuRGJVeIu4raaY1jmDDR9bqJjy5e9dr3WnwKz7M5cmp3lUlWLGJED479fbywFnafdVnDrcgMpBMEsotbYx1wbwjiQVSrOGabo0k2IiPgeVpxbUzZMSsD7S3ImbHoPPzwylJNpoVsQ0KpZgDT1CIALiB11bSAPl7mdeqEt4WJA0iNO/IAbTizPZemx1aVgGwk+3y3nA1FTSDVTp1x5R5AHf/jFotTXALKGdWgtAJPhTck8uXXHucWSFBIFpk21E3MiwH5YEzOeNdlBXa56zMmOgxZxDOmyhQq7eYjeIxSkMkwXXe+46eX664shP9Q/dbA9fMAEQL4H73BQaOr8ZqGrRanSqUyzWILhDHP0ovy9uMsvAM3TOtKLEjmump/tLTjt1bglFt0X3YX1eydAmQsHqLY09Nyds9Ts3bZaEXGKVHJf3znKPpa05AlWWOVtl+GNr+zhmFKpXcy1V9+ZCzf7xb3YbVuzDhvBXqgdNZI9xkY8PCM0llqqQNgUX8AMaEHGVsfX7YtXTcFFK+fdCT9oNSuuYyGdo0mrfR2fUigk+MKOQJiARPIxivMcVq5zO8LD0XolDUzDIZOkDw09RgeI6ZjlqGH3d5xd6dNvUWX88DrxOqGKNlnBHNWDD4xi/eI8/uyHZDOmpxHieYDSmqnQX101h/iB78C9gMov03O1wZp0q1SlRXkus6qpHTkLcsHJxOlTnwNTkyf4ZEnqdM388Q4Xm8pRUpRemgLFiuqJZtz4rycHemLsYl7c8fennsz3Xh1Zanlmq8qXeuTqPP0Z9+LuIZilluJ5bK/SK9KmmXpKvdaoep3rBRUAkaWEz6xfFvEOzlKumaAqtqzLIzP4W092RpCwPR5e3H1HhWap5t8ymYQh1VWRqdyEWFE3jxXJHU4IKCOyXa6vUznc/SO+DZivTeiQJo0qcmnUDATBMLB64fcH7amtXztMouiiHai1x3gpMUqSZOzgCQOeOeZLgeeoCk4WialAVSjI3iqVK8gs5YABFkmLzGPDkc1k/DaqqZStTRqdNvSqspht9TFvFPrwQUdO7MdpKWdgNQ7tzTWuoYq2qm8gMpHmCIIBwv45xjuK70VpKyAAiCwIBAm4JAE+WA+x/BxlAHaq9Sp3SUvFEU0W+hYG2onfpgXiHF6TZqsrgHURTNxsiKRuRI1M4/tE8sR1b2qmdnYlFze+Nqvyg6l2jy5uaT0z/KQw93hwyznB61QB6LJpaGhp1EEC03G2MzmczTWjUZCgQISEKhvE2xNyZHojGu4JxSKFEE3FNQfujElGUvhkV7ZDRUVLTVZ8RHmeA1y5NSkWtAMhgJmRYlo/PyxjuN8MqU9BFN10jZkKidQkdT0m3ljsacUU49fOqcU7pUcG44BVb+MdRHiWCoNiNpnnAke7piNesNVRit4sD0Yk2nkIOw53x2fjvDKFdCCiT9oqpPsMSDjkfH6B76oosULKJvKq0QJ6i/TfEpRrk2ADXQdI0jUYBfdhEzGwEiPccRSrTM6SF0t4gRBIEjV8AdsQ4dSksopiSLTCyYkHrsQYnkcSWpSqrpP8NhIBG8THvsPdiL5EZbn6VSzoVLD0b2PMz5RJnCyhn+6rMHQAgS0QTJANj5zGHmTRqTU4ZiJKmxaDa8jYQZ9QOBuM1UAqNKyjAHw6WgWMGIZQee+EhPO2rEsX5bM0tcijpDEAmCNPTqOtrYpy2ZZGbWggc+smAfZ5YrymfUuqjUZ8Rk+EbEiDygHF1fMdwzBvEhYixsJ8Q/48sdG3yFGOVztNxFisG2qDa8b2POcI85W9IDUCDpvsALD24vrBPSWQxvYG/vtHL2YnngHprpCrVJ2BA858zyk4EYqLwZYA6XgaVkNEdZIifZzwdllvDmWPXqRfEFFVWD1AAAkX3Hs+1i/LVkY69mUXkwYI6b4pgawivwjUZNgZ23HTcYK/dlP+T3P/AO+Fi8TNQ6UGm8AeXr6/nhj9Dbr8cZgto6fQ7eZc/wDUpZin/aT/ALXf5YecM43RrLrps5XaWAW48nCnGXzOUXW+keHUY9UmPhjJ9p6ZSsCpZZQeiY5t7cdElSstGTbo7CKkmzA+z8VJxadXNfcfzjHBV4rXXavUHrYn5tgvLdp82u1cn3fguJ2h6Z3AN/Kfn8icVgrqJIj1qR8xjkqduc5zZWHmD+Lfhg/L/tJriNVJT6mj5L+ODgOTpVSjSe3hPtGAsxwGg26D3Yx6ftMU+nRJ9x/3NgzL/tByh3psvqB/8BjYAMs72Qy7XCQfK2Kk7LaR4K1Rf7z+eLKHbDJN/wDKV9ZYf7zhjR4xQYeHMKfbPyAHxwu1B3CV+B5oHw158mRT+E4CzNPPU/qUqnq1KT8T8sa4Vw2z02/uAPwJxICL6besfjGMazFpn8yAC+VYH+Vw3zAxk8zwltRY1aqkksddHmTJujH5Y7EzCLqfdP8AtnFNYUibkD+q3zwJR3cldLWlp/tOOrkXLKGrUik3kspjnAZRfGvpZwn0Sp/pYH5HGofhNCpMqreqPwwp412RyrJ6CqZ32540Vt4Draz1a3dAQZ5huCMXJxXzwo4n2Tq09Ry5aNMiKjCSBsINutumFv0fNwQr1A4AlWVagkiQJYFr392N3rTpo5qNeOKdTbHMqr99Wq1gkS5vM7sWJIkE7xbyw2oZypU103AEeFwfCRyMQB5j3DGeqZ4eJQSLFZA8V97Rtvz54SepuWEAuoUSSpRwbGx3n8Of6tjyvw4kCPEXGoMbRp/H8RiOWrKEXSLTBYzK+R5ySeR9mCqSlQzKCyqpJJMSLyb7Hy6jEXYOT3s5xCNKvuuwFmJm9/UbSQMXZ9YqOqglXEsrGQwaJKyfCwvbFvC+yNerohC2mdOl1DaTc2JAIFrTMxfB2bytZQUWg2pSNRBNQSs3USbzuOYPliM9KW61Fk2YHitAIyimpKgA69pnoRvz6erFrZxAqllk7bAgnmD5QLc8MeM62ZWfVyBVhBGkGLkAkx74xVUpgKKgKlYEiPKRB5WI+OOpP4VYLKqdWlpBhoEektgLQbfrbFGdzlNqZKCSDvA1KLARbb8xj36bS70KdiImTCmZt7QP1OPsuypr3udgAZvFvaQcNVZATylUFb+NjI8tvPp154+zFZGApoPSa522tJJ5Yup0SoXSPFaRPiYTc9NVt/LEM9ladOly7zYRfczc+WFTp4GVA9BIupCsLgkgdR+vVinvX+0ffiqmnhUEXJ8Pnt8jjX//AE64h/oj7ww1McQ03qD0MzVHqcj8se5irmWicyzRtqIJ9++ENJJsBf4nD1ckm5kEjrESMWoeynVmR/8AID6wPyx8cxmBuEb2R+Ix7+7+lVvbeMMMllLE6pgc+eA8BTsXDiVQWNEew/8AOJJxkgXRx7SfmMNTlTbwqb/hj2vlNNyoi2x64FoamLqfHFJA8Qn7QXFycXp8yvtU4uGTUxa3rBx43CUa/hv/AC4NIFl1Hi1LYd37wMMFzNNgPCDG0EH5nGfr8GUSYX44qpcCnkPYx/HAcQ7jTUq5Hos6+0j/AGkYvocWrL6NV/if904yNThVRLqzj1Nj40swIiq/Pe+NXma0b6h2pzax/Gn1kH4ADB1HtvmRvob+0D46jjmwqZpfrg+tR+WPvp+Z5rTb2H88bJsHTV7bHaplw3WCb/AYIoduMtPiy7r5wB8r45aOL1RvRB9TEYmOOmfFRceog/MY2TYOrZbtbkyf+pVTyAaPjgWrm6Dk6c2BMXLkN4SYFiDAk45n+/KZ9IOPWgPyxNOL5cncD+1hgmOl0+HAFmU0q0yZNjz5yZsTjBZzJVi7VO6NM6iSI5cwRaTtsDgVM/SJkOo/v/PB9LPOPRrN7H/I4SSA1Z5wfIh9SVayUw1ySHMwRIhBOqY5bTcYN4tkkpqvdOlUfW0q66QNpDqMR79yPG0+sCffvjw5wotkRpAnXPK9iCCNxibjZ0/pL0O8vJ1L9njg0GPPVB9w/PAmazR7yqFYMwKoEYalT+AzKYJiS4Nudp5YTdjc/nVLUkp0FVh3oV+8mDEQVBtBESMOvpOdUnXl6ZH2Vrow2gWq0ENv6uWPQ7NqKMcnnTg2W8Sy1Ktksw5oqI1qoUNBKMU9FSJ8QNueMUeyGVsWp1VgQRTIifGCCrEk/wDTf9DGwpcZdU7tsjXVJm3dVBOrVP8ADrFjLSdueFec4nl216qdemWmdVPMIvi7wMZNFlnxnyv5Ytu05WpeIrjJHMuL9ne5pvmAupCZpzvpMQDHOCPLbCqnn0DSyEACBC2vEnp7MdJ7aZ7LVMh3dKqjMCsKrSQFgXMD6o6C5xy2o7oRItuuxuDefdji1FHc0gmk4TkXr6mpUdSg6e8ACSCstdyOowPn8iFZqTCHCiJYFQRvtI5Rv7cU8PIqUgxUDl12m+PDXUsiPY3vsIiOu4IxBxpYOifZ3DSU75OncF4RkauUytTNU6C1dGgE+EsEOkes2+PnjY/Rj9up95sY/wDZlRpZim1J6asKMFWYSdTklr8thbyx0nuj9r4DFNOnFCJ4PzFkKELLKNXXn7cGHC3M5pkcqIgRvJ5A9cR/eLdF/wC788O2GhpzmMX5emp1apHtwlPEm8v+7/2xF+JvFgvx/PCt2MlRoM0iqDpYxvvtbC7KAktNRm2gGffc4UV867IQYi+w/pwJSqlCGG49eAoPxKbk08Gvy86hvtgtHG18IOBZ5qjkNFlJtPl1Jw+RcaWCSyemDbF2WVQYE/Plj6mmL6NHxD9cjgJ2ZqinNINMfhhXxyqEVSCQ14t6sOs1QMbdfkcIe1lAjuhG+r/xw6BHkH4dniy+JiSDgo5nzwmyEgsDb9HBpOFcmijiiedzahGMjY8ufLFvClDoC0zHnzwszg8Deo4N4NXK01AP1RzA5kdPLDLKEeBkMgh6/r2YFzfCBB0sZ81kfLFw4if03+MWJxA+XvOMYznFcl3amRfrEc+VsJguNdxxzUUAR5X6kYzApGLcvZBxkwNmm7NgrQJJN2bfoF/MHDWrJWASDpBHt/DwYa9i+G01yaVqtx4kA39NGLMbGwViZ/lje4pqZZVqvTMgd02kwQbXQwbizC298Ta6nt6bUtLu/Ie8F7f06RGqi3oBfSEiAAPq+XXDxP2mZM+kjj7h/wDIY4rxfNE6KZMlAZbaZOFFc+L2DDwbo8ZJM/RK/tB4cd6ketD+BOPR2z4Wds1SX1lk+Yx+c1xKgksJMCYJOH3AkkkdT/aNxnLVe7NCulRdLB9DB/SIA5yD+c8sYGmVK/xCCRYTfyECd/LHn0OmJWCSVsYuvXz+WBlor9RtjN7zYfniNptsg8seUlC0lA25e2TgZqSuWBtsQYBNyNjyxu04bQpUFUjvHZgjwQdAKtdZBmLi32T0wjy+VAWtQdAzXEwbEadDTsOdouYFsNtdHrTkpaW1eBoP2XcQTKtVWqxUEalI8WoAGQY2iJHtx0H/AP2OT/1T9xvyxxPJV1HOCJEzyMyN/PF/01ftD3jBjSR56iZXiObZahACHbdQTsMUniTC2in9xce8ZpxWYSOW3qGBqlMjc4pgVMubirfYp/cX8sRHF35Kg/sX8sUFfMYgKPnjUg2H/S2qL4ojoAAPq9BiytTBAlYtviOQy3h5b/8ArgtlLLBje36GMNZ92crlqsFUHgOygHl0xqKSYzHZylGYPTSwnGqpkCAd8TmZBFGnhhkaXjX9cjgfL08NeG0/Gv65HCx5BJ4K87SMe/5HGe7ZUT/AG0l7+xcbTP0/Dt+oOMr29WFof37f2YrROLyYqqYcXkEQP178NuBcOGYcqagpjqRM+oSPnhNVYQLc7E77x8saHs0pLKgbSGJm0iwkEwZwNqcirbSBON8O7ir3etagizL7rjcHCzgtazKVUxG48z57Ya8bLd5B9FTA8p/Xt9c4WcPX+JVHmPmcaqsFh61P/wBdP3H88XU6v8lP7uKkXBmWyxbaMA1g2e1Mlgo9Sgc/IYzVVIUGN4vsLTPtmfdjZVaXg9o/3DGaAkkMvpQYFxeNo9/swrdA5Oo9ksrpy6khgChRiFsdYVQA0T52NtINibw49TVc5Rm4NLSb82UCZJ685xpeH8PoJlabBVDGmGZtmLKs872PLyxiOMZvXmCw2Vgo9QB/EHBeInr9n+PWdehzjiAC1qi/zfO/44GrC/sGH/ajKE5qppU6G6L5kfKMLKKgVFLCQNMg9OeG6HnzVakkD0qfl8cWpQvANz+vb/nGsXP0KlN6THQtthMQQQBa9x8cInoqHhbibNBO22+FnhEpSUo4K6dcapGmYvf0YmB1MR8cWZDh4NVIgMWG89dwLz8cLM+hSpIF29szz2tJxouD0K9Grlq9RAERpLKQYkGAwFwLW5GN8LtfKJRi3JUdKTPUqVKgKh094ZYnY6gwAaYgXmIi2wwi4XWCZ16cSr+EadiIaDyERHuwf2rzwqUKYampWoCwJm6xqBBGxxmcrUFOtRqUwUFgQWYgXIJkyQTPqttizOmMnucX1/6J+M5VqWZqJpO8+w3wug9D7saXtPmVq1tSywRdGsfWiTJtHPCWcCibuyni1NDVZjZrTbewwtzCrudX6+GNxm+w3EWYn6KTyHjp2/78B0v2d58iGyzx/XT3+/haJRj5mZynDw9QoSQN5i/q+OC89wVVQlNVr35/ljQ5fsJxFagYZZ45kvS5ep/KcOMz2Oz2kxRLEj7S79PSwst27B0R21k5vl3KA+3/AMcTWqWACAk/LG3yvYDNqoDZckxckofd4tsQyPYnPIzxlWUE28SXF/5sPJtLCNFJ8syWVV6bbeLbyg8/LB9DPtvFzfc8sPqnYvPl/wD8ZoMDVqSwvP1sBV+xnEQW05Ron7SXjn6VpEYEU5LKIyxJ0W5TjbOFVYDEwSR+hjY8EHjXxavMx0PQYx+V7KcRBGrKN65Tb341XZXszXo1NbUmWeUiBYjrcbYyg0xbHfEBb9dDjEftRBFPLkfab5LjoOcyFUiyH9A4znbfgmYqpRFOiz6SdQEbEDeTh3ZoYkcarOdyfPGw4BnRT0uRKne0xNwfw9+Ka/YXOhpTL1LXEhd/fhjkss1MGnUTS4swMSphSBjRyW1OCXEeLUCzNToS5Ea3kjp6B8O/UHGfyR/i1rfZMfHGip8MauzLSRnKiDpvA5k/3fPAp7K5xHdly1RtUfVjYYDESwCd7G4I88eLxhFEkHeP84tzXZjOsQfotbbku2B8r2ZzyMH+h1iRsNHzvhRWx3IelqGx0n2ahjL0ZFcXJlhHT9R8sbj90ZnuvFQcGxPhMC4J36YymXo66ysT6LczMgbEeWEkW0I7ppeaNZw7jhph0qAugRig+ywjSdxYXwnydYsNR3MMfWd/niNQ3f8AoPzGKuGnwj+lf/HAvB9EoKM7XUA7SUbq0dQfmPxxf2f4WtWWYN4Y2Mcpxfx6lKm8AEE/LDPstkSwrClFRREWgtKnw3tqI5Ax57EvDKPH7atus/MlluH0DVan3RfUqtM+L2Ny89sJOJ5Huq7gISAxUBrjTMEE77c5nDdeJ5em5VqLIymCFAWCORAqfqcK8/mC7O6GASSBPKek2wsnLNnPS2ugSrwguZpSUEvcra4sSTuPKSbYY5anVrgj0dKwTUcxyn0tjafbgH95rSA1amYyNOyxFiD1m/tIxbmeJE0yigfxIAYCP0ZO3nh9NfCQg2pJouq1qh0Uy0qkgXECYG/MYnmwNL05gejPqJxXmmNJxTZZbSNSreCQNSnYTOKM5nfC0q8gTc/DffDLiimpPfPcUiIMEmf8+eKJxbUrEsV6KLz1m2B8YB2LNcazjVTUpVFFNWIFLuywIBiGYGQx9UL542D5sdz30fU1R7NvfbGMrp/1QEedRCqKZWpBEErDXLEAyYkDzxsXpxl9MMYTYDxG0wB15YnpT1He5FdbThFLaZrhWazoqipVqpUpsYamKenQDMFW1GYjmBO9tsO+0eaqU6UUiBUY6QzCQvMmJEnywqyDsWpr3TyT4rCaYv6XkDa3sthl2nMIjhS0OAYiwaxJn9XxlLV7tvqCUIb0unqD9mczWOqnWqCrbUtTRoMcwRJB6gj3CLgdoa+cesVy1ZaS095UNrMTeSPDygdDfDLgAfWxZGChQFYx4jN7b2ge/AvEqVQV6mmmxVoKkQZbTBtyiRc/hjJ6vdq+Q7dPvH4V4intT2izJpZSlloSvmAWZolaapAdpiyyRc/jh32Vz1V8uTmINRN2FtSxKtHIkfLAuf4fVC5ZxTOpVYVQrAkaoOkRGrxdCBaemCey3C3pU6xrai9Zy51EHw6QqgQAFAUREW88Ui5uWeCc4xSx/JmOzXHs/VzAr1dAytQ+GmRDKrGEYW3upudjyw37b5nM+GllawouAH1ETruRpBvGxJMHlgSjwyqGopWJREqK7E1ECsqGUUGPF4tJNgZAudi845lnZ1dUV103loIIaVI2tBab9LYV964OnT6GcYKaXT1B+GcZr1OH99oBzADIUNh3qsU+7In1Yh2Y+kITRzOZFeqV1kBI7u4ETzF7SAbHBWWyL/QzS1K1Qg+LVK6iTFwNhblywF2b4X3VV6hKgEEQH1EsWBLHyjSAOXtxROVKxGlnIkfjuZ+ms4qf/bpVFE0tNiNQQmd9cnVa0W88Ju36aM+qpMONTmxJYwLCLCAPjjX5ngQ77WwQKKhrSahABkT4Y3jntOMx+01IzWWqqQQykWPNSL+0MPdgR3ZsMlHoNOGVdGToJSJpvWaoDUUDWQms2LCJ9EX5AjDReMVTkKlUSKqk0wXUi+oKrMAJ2IYwMB8HyiVMllfEmtCzLqfT4mL2t6+hw0q5CkuVei9RAKjFizGQWZtRuTfnz5ezGzdg+GvmU9n8860ay1Kpr1KKhy2kLOpS6iOlsCdheJ16prCvVWrF/CsBG+sin6yi1+oPrxLhebylEVVbM0NdUCYaQAF0KLm4Hs3wvPaHL5NwwK1iysAKVgBqG82kxyn0R5YyvBvhz9ifB+0z13KNda1Ks4H2O7YBQPWpM+YxzvI0z37kwNzHlf2f8YeZLtQlNiRlwo0skyZAcjUdtwJjCjhdNXq+E6jYAAEGdxHXb4HEpKVZ8zr7NtevGvL7BlbKvq9B/EpC+EwxkGBboCfZhzQ4Qj0e8Q6StKW0guuoLMEekjWM8tuuKspx1qOcpUMzVtqnSVkpqRgCWG4M7XM4+4zpyzPUp1SuqRpEguDIMCJ6WNr4Kjg9KWs5alXVBnb/AIfTp0qDIo0tTb+7SQQ0iCSZnCPgLOo7sAKY1sNW8iBBtPqvhXmuMGvT0kkU0MLqa0sDMDlijh9BqriTDDxWgT5CTBWfnhoZPO7ckqzfOfmfcY1d87bHnv6sH9mcv3rOjizI66oi+knfadsA8QFRipBG5VixJi4g77XPwwdkDoUq5BbXuoixsZBvPkOmJ6z2nN3lRonw7s53pbUyKysbMSLT5/rzwa/Bq6n+DURWBkeP2REGbAGYwm4lxN6dVtAFl3OoHmTEG3nbC/8AflQ/VEET6ZjbyAnzxXT/AGpkcs0fFsxl2aiaCsriRV1EklxHVjz1YVcQqFZbe23XEOzlcOh1n0WtPnc4v4g6K4UgN4Zjyk3w1DXkGOYkxHIGfXOBJwYzKQbYGjy+JwENZ1Xi/wC0GodQo0gv1QzEyCQYvAAO0DrhE3bfMws5iY8MKtwSSBJH1hYEHzOENSmrgkoZ1Q1rNJHi25RedpMDbEMsEFl06p0ssrYASbiQbGJMTtiSk31IjurxvMl+8FaqHGmzapAbeLCRzgEgQfLFzdoM2yGm1RmQybsDznTtrBB5H4YQJmAG0QzW9JQRo9IFPDEgi3MevFvcq0o7SGDMEaQwDQwEEE6gY6i2A20axrU7TZpoYV6jL5LEEGfEecXv5AXvi+h2rrmoWWsweoBHossfV8wJG8Xm98ZlalM6lVnLeEyeY8SQCxFx5/HEaNE3DMQCdQK6VeJm4EHqI8rYOQmmzfaPNlSzVnZR44BCxGxDKBIud+m2Ks5x3NVgD37kEixIUAeZXnNr8xjNaSi6aUgbix2B9CI/mO29hcnFyDVqGmxuU0X9SxsDI6wRsMa2YOr5x41S4jqZuT4pWbiffIwLmKzC2rSSvh3BPTw2kW2O2K6mmQruASpBnmpFtUxcHmD53x5lMq4VkD1IuAepWethYR6m22wDBNLMGSFLL4TKhpExBPUA8wQSJtzxT41cAEwsyPDrMwQBHOPVgRMwx7uPC+nSZkekBAmQR0n3+b3gWRpMddRR6QOhHKtpjyBsYNtUbi84KQUrA81mm0wGqVFLagWaYMEjfYGD4vKMM8v2drVu7qKgZd/SC856mBtgf9x0tAUUCFkIdBcNpBIVp0ldUeJjF4xvOytNVoU1QnSAAJsbWxSKV4YzilwzL8R7N1lXWlLRAkgujKIBMgzqHWP+MZxDSsO/pADYhr7dJiZvvjr3GYFCrP2Gt18J95xw7huTo1XWFlSZ0gw2kGSQAJNoEeZwJxDFRvIyrVqSS6ZimSASFtextY2nb3YTtmdRB0AEdGufhi7LZWmy1GpU/AGKzVA1KSeomwvv5Yq+iMNIKaWImGs0dYsYME4EK5GnGKlSRKrmSRstr8vjaT6sNOCZujQqrVNamYm1libew4SCCpt5e/b5HEVoITTga3LL4QABLNADE7g/o4doMJ7XdD/iObSpmGr/AEqkoMAqApOmIAkyZjmBgftDxylWbUKrwvoBUkLtJliASY9Q6Y+4Tw1lznc1kpIzUyQFGtR09InxWOCv2m5UL3bahyAWI+oLz+HnhVEq9eXNGeyFOpUK01Hg1WLAJMAG5mLAnbGr4PRFEvVYowprbRPOTAkyRIEbm5xk8rSYVHgtovpDTIuAZHI3wYWbef1fDp0c825cslm89UYKwVh4gTurXnUsTGmYvvgjK5xmFRiukSCqggkcmuZMXEdIO2Au9bkT78SSpUaLm+1zfy/XXCyW7kG3AVXppqZmJJghVsCZG55AC/PCjhq94/dQ5YgqoAkk8ojc+QwwLMBIJ2n4xiK1W+0ffjR+FUZRAsqopWJmTe0QRIODDU7x5AvpAj1E4Ny2bcbMR+eCHzb2l295xkw0xZSonY+HqTYAdTizuE/1B8P/AGwctVz9dx18RxPU32395wbo1MC+jDxLBjUIaCWSDsRa9x4pG++2LcxUfUAzghlCgsAGW19UQSpE77xOB+7g+JRrgNrCkEiSbyPED7It0xdkUNUpQCqHe6+EKCRcnxMultxOx1erEXJRVt4JpN8BNPNvUBNMgsIOkeEXnbVBjw7STc9TiipWLhTrRYWRMgmCD6jHKN7YtzmReYegWOrukdlbSDMaC2xYkAAA8oxVmRVos1KpSVTSMlCSGWTqBABINovscJHUg3Sa+odrXQtU94oA8J1FSug6Z3tvYiG98YqzPN+8TVcAKCdQg6iYuJ5bRGKddSYDE6ls7QJJAEMTaL+422nHveVGPgU09W4aACGIttePbvigKCstoK6A0sBJUMbLMkSOhMixjqJwOma0sIAt4QSSzKfODcTOKf3dXLawIZT4W8IkapuPsxI5YvHAKpJZVILQWADDxeEypNiJ9Z64FpdR1BnuazKEDSl7Kw0raYuYEi5m3q88UZjMBWW2uGNmY6gDcmCZgf09MP6HZJ2BFSAvQNc9bwCLAfqcMsr2PUFmFSBJY6rte1mte3twspKKCtNmaTU8sKZMeFZDoEmSp1CJAvaIPXnhnwzMqAEUNKDS2sX1TOpCfEV6arj1Y0dHhYo6GMlgZE7mJsRuRtY74IzdIVDrddT2UmPFO4AnY+WOSWtc/L16+FAdJNPkX5TPA6hJRWUEwGKl/qyTIEmTM26YfcM/hU1QMKhURM+U7kTMYS5jMs1Us7ksBEmxH9tvPFvCuI6HmREg3O++8cpAwulOWn8aX0/t19/sJas0Oerh6LWmZK6hEMs6Z6XHW2M4nCqALPTVpZzqDR4SQNmEFlment3w2zudV0Mei1wAASAd46m+FRzKz6VrRI0gWuLk2B+WLS7U269/lfcfvHFUme5bhGWpq9Kounx94sASC0GDbrz6HAfCuG1lzNapSLKQstpMs0MTIuIFwAJEgYc0MoyisWqICsagXkuLG3KNoHURywPl8yoqqzEtzK6iJBsIK2Mcwfwxyfq3LdKD3PH2r9vrzfjRTdbW7HtmOz2VepUrxoqO9QswC7zNxpEKAT5c98Z6ind1UW3p0na/RyBFuU3xr+JZeK1XMIWVmMQHbxBo0BFYXVYNgfrbRGMrxDLSBUBuqmZ8jI9sjHq6M3KCbVWBrwG/GK4TieXebQoJ/qNRPmwwo7U1Swpjfxvc/wBgA9g+eLa+W1ZhQWJlNU+ppHxviHF+HP4Wkm4EReTE7E9MOmFouq92FqT3veu7EzAQAtPK7csCI0YZZ7JV9ALXVLza09eZwtCnBTsVo+pjE1a0C3W9rbeo+eIIYx7TjpjGJq0gyf1/zj0pB/zOJKNztz8949uKatW4sB6tjjGCcqbnBB5T8MB0H8RwTUH5YAT5W9vtnEpx5SiN/wA8fT68EAAeH5gjwJUJIgiPDYwYn0REESPljRcD4I6LOYBsLLJbwkqw2MKIGwuPFyxruO8NagYZVDGSdEnUNQ93tjfAK8R0kEMEkMQxMWCwRPW5Fzz5WxxrWc1aWPaZNvNE+HZFGpDLka6KQxouwAIEwFNjIsd5MYWZzsqtaqxUEibAli6ERCEzLAC4I5HB/DqEtqCNXpr6enUoU+Zvyw1yldQ0UWaJME3IBHXpJN/Vjm293qtx63XRPPXnN9VnHLLRnaSkIsh2YVBpc6vXNjz5+r3YLp8ApCzIGUbKZMe/D8ITcmTzJ54l3eO2Mer5K0hZQyKLOmmo+I+OCIPID2fqMFd3j4LhgUL6ecQtpDBjOnSLmYkj3Y+fPopmAQdvFNuZsQQR5xhJx3IVKT1q9Mlaca2AiGNwZ5yBf226YzWVzdWGhdwWMG+kjxX2AM/HzwnaUpWtNtKuvj8hZSrhHQa2douVjWbSWBkBTuDvAvMm+FPfTUuGKdJXVpvtaDyvG2M3Sz9alDAHwwwUg6X2BG/SLzyw74f2gerBchKgEXpqAY5QLXx5kOzT00+vPV+/6Jaj3Z/BKpXNTUS/iIgEwTA67TuemPa7CoVamgpSACqvYsJOxAjb14hXzS1CQVQXlT6IG+sAC2k2/Rwmzr/xSjMroxgOjarKZJB3AgkbfLHQtOKa9PP6eDJ5p+A/TiDFBSuF9KG5QYJ2nbkN8Kn4jpeNxqsOR/Ef5x9Uz4hxrJFO4JYAsTtvvB5X3nlgNE1y7XY9CCJJvcfPzw8dNLoK7fI1yGZpMyB9UHwwphjO3sm+GWTo0mdkMgp6Ckne0A+dhI2t7MZzIRTEsyl9R2F4Hr5EcsOspn9WhLQbqPszc+YMz78S1dJ7m17646DxdUqHH0DX6IhgL72YQVIO8iCZ6xgRex2oN3jzqmYub73PPGj4ZQYLa4HMHad5+GJtRt5/DHVoSu6/nqdKhSViHL9kaCsr+IlV0gk8vZzwenC6Y2UYMdW5e3ril0e/w/zi4aKM5w1KlNqbei1iRY4xfaHsylCmaiVGYAgaSBNyBuD59MbGtSqEfPCDjPCs1UUqpBHQjp7cFOjNGEj14+VfL4Yf5bg9dW8dBvWsEfPBjcNP+lU+4cHcJtMq7+v3YoKY1pyA+w49dNx+GIHJIN5+635Y2420zuVtM/j0wQCJMn3DGjy/D6RB/I/liX7spm9/uk/hjbzbUZxHA9Xqx53g8/f/AIxpxwqntpc+pG/LH37qX/Sq/wD82/LG3s20YZ7iVaqVUuxAQKTtKggwzCS0EDfy3xmOK5yqX0azubhjCj0W8MbkASeYHqx5malYVO7JALQbmwBH+D674s4zVSUBIUi2nkYEkArs+wAJjHK3Pdk59rUqY+4StSnK1HFBFQMXNjCuGGkgHxmTEkfGC+4cUOvuyWGre0sCYBIG0mbeYAFxjAcVziB9C95ZgT4pBMCJ5ETf8MaTs7xSszKFp+k0tBT+HvL8pXxERcxGIvvsUXjng06meX6/XzxIA/q2L6jSZgCdwthPOBy648Ax3LgoVaTiajyxYExYqTgmEXazLl8pWVbELqm/1YYj2gEe3HL+GqUBJBJ0kSsWmOoMD1R68dj4zlC9CsqmGKGDJF48scdy1NkTxFgTyF5F7n4WjAZj6pmjcsL+7BuTXXTkSSbQACbXiTuCNVh09WAWYNEgGLdf+ME8MYSRKixuRe24B5T+GElwCf7WH5jXTZVqKabkaiDAsSYnoTHSce5PINU8QIFtpiDf17RgZshUrMWh36m7HSLev1DBeVq9xekdLC1yTbnY22645tz20qcvfqczSvrTCeIcKRQCQWIkO4YOjOw8MxyIt7IscQGfSouuqqlwoRUBFP0bK1kJJFxB3HOwwOM0aUMrKKkyPrE26bEb4F45nDXYVWK6oEwNNwN7TO2+F04zUluzzn/P98qHjTWPoXU8prGl2BISFAXSSbyD1YTMkncC0Yf8L4WlMIA2tiR4hZhb6s3G8HkYxnsnxNVV9aa3I0q0xpmYO/Ix7sPeDqzIrFGdQxuoMgmJ8XP29cDUUm6j08scc/X0Kaap5/Pv+ToOXoGNJUgQBOmCbXnBIypA2PuxhqDVbj+KBH84vi76ZVEjXW+8+O6KDZsjQgWB9WBKi1v9Iff/AMYzdXitUC1aoNvrHlv88QTjlblXf2kHD4NbNJFXnST7/wDjFiZW3iA9jTHvUYQUeNVtzWO/lt7sSXjeYuRWaxO6j8uvPBsBoPoy9Pzx8uWHl7sJU45mP9WbfZXflyxXU4tXMfxY/tX8sDAdw/aiPLEu4XpjPLxavzcH+xfyxaOMVjzUGfsLty5YFIO4dmgByx8tIdBhQnE63VPuL+WLV4rU56J/oG2NRtwy7u3LEu7H6j88KE4rWmJT7gxZ+9a/8n3BjUbecafMMG16jMzO5ttc4Lz1ZCqqt5uSR4ptf5+84CpC+Lk+tibWbGcU3ZRUTaBsQfcZxqOyvEaq1lCqviYAxJIHP4YzFbdfWPmMbvsgf43s/B8bqgm20nElpevEH2OJKdsUASKY8xaBbHi74xgbP0XalUWmSrlGCm4hiCAZi14vji2WRrlidz88dwzDkI5BIsflji7n+JU/qPzwGZA9VZsbgWF8W8Pq6SQoU/1GIuBv7fj5YjxcxTpkb3v78CU/QBwrQWrQ2yWcaGGttyCENiTMRzI32t+Kc1SEZgwa4uT4gTyjkB0wzqoFoBgAGgDULGCDIneME06YNB5AMOIt5rhFXNHM6RnzmSTZthvznngvK0yygdL6jzE3PmLjbA6CSZvi2kbg4cslgvrvoWQQfZvf346p2AqJ9H8JAhmm/M7G/kF2xzQD5/ljffs+/wCnV/qH+3AXI1Ys26MOv69mPl0/o4pAxAm+KACSi/oTilsuh3RfaAcSpjHq741GuilsjR/0kP8AauI/u2jzpJ09EYdaBGw92B66gbCMajWKhwmj/pJ+vUcWDhND/SHsJ/PBoxFjjUEGbhFD/THx/PFJ4NR30H7zfng9tse02PXANSA04NS5Uz95vzx5+5qP+m1/5m/PDLHtRjG/6jBBgXLwuj9j4t+ePv3XS+x/3NgykbYngBpH/9k="
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Kebab-Treff</div>
                        <div class="carousel-tex-subheader">Furtwangen, Germany</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="https://picsum.photos/510/300?random"
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Wolfang</div>
                        <div class="carousel-tex-subheader">Paris, France</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
            </carousel>

          </v-tab-item>
        </v-tabs>
      </div>
    </v-layout>
  </v-container>  
</template>

<script>

import { Carousel, Slide } from 'vue-carousel';
import {eventBus} from '../main.js';
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from 'mapbox-gl-geocoder'

  export default {
    components: {
      Carousel,
      Slide
    },
    data: () => ({
      lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`,
      date: new Date().toISOString().substr(0, 10), 
      time: new Date().getHours() + ':' + new Date().getMinutes(),
      active: null,
      searchTerm: '',
      mainMap: Object,
      geocoder: Object
    }),
    methods: {
    locationSearch: function(e){
      this.$router.push('map');
      //eventBus.$emit('LocationFromHome', this.searchTerm);
    }
  },
  mounted(){

  }
  }
</script>


<style lang="scss">
  h1,h2,h3,h4 p {
    color: white;
    font-family: 'Roboto Slab', serif;
  }
  h3{
    font-weight: 400;
  }

  .container {
    padding: 0 !important;
  }

  .top-area {
    height: 20rem;
    margin-bottom: 1rem;
    border-bottom-left-radius: 7%;
    border-bottom-right-radius: 7%;
    background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */

    .flex-avatar{
      img {
        border: 3px solid rgb(255, 255, 255);
      }
    }
  }

  .v-input__slot{
    border-radius: 10px !important; 
  }

  .location{
    p{
      margin-bottom: 0;
      color:rgba(255, 255, 255, 0.75);
      font-size: .75rem;
      line-height: 1rem;
    }
  }

  .v-card {
    border-radius: 8px !important;
  }

  .d-flex {
    height: 10rem;
  }

  .v-tabs, .v-tabs__bar{
    margin-bottom: 2rem;
    font-family: 'Roboto Slab', serif;
  }

  a{
    text-transform: none !important;
  }

  .active-tab{
    font-weight: 800;
    border-bottom: 5px solid #ffc400;
  }

.VueCarousel {
    width: 100%;
}

.carousel-text{
  font-family: 'Roboto Slab', serif;
  .carousel-tex-headline{
    font-size: 1rem;
  }
  .carousel-tex-subheader{
    font-size: .75rem
  }
}

</style>

