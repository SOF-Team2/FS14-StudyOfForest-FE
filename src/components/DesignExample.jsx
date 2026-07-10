import tagImg from '../assets/img/ic_point.svg';

function DesignExample() {
  return (
    <>
      <section>
        <div className="inner">
          <div className="card_container">
            <span className="container_title">
              컨테이너 타이틀
            </span>
            <div className="card_wrap">
              <div className="card">
                <div className="card_title_wrap">
                  <span className="card_title">카드 타이틀</span>
                  <div className="tag point_tag"><img src={tagImg} alt="태그 장식" />310&nbsp;P</div>
                </div>
                <span className="card_status">
                  n일째 진행중
                </span>
                <div className="card_text">
                  카드 내용
                </div>
                <div className="tag_wrap">
                  <div className="tag">
                    👩🏻‍💻<span>40</span>
                  </div>
                  <div className="tag">
                    🔥<span>16</span>
                  </div>
                  <div className="tag">
                    🤍<span>8</span>
                  </div>
                </div>
              </div>
              <div className="card"></div>
              <div className="card"></div>
            </div>
          </div>
          <div className="card_container">
            <span className="container_title">
              컨테이너 타이틀
            </span>
            <div className="card_wrap">
              <div className="card">
                <div className="card_title_wrap">
                  <span className="card_title">카드 타이틀</span>
                  <div className="tag point_tag"><img src={tagImg} alt="태그 장식" />310&nbsp;P</div>
                </div>
                <span className="card_status">
                  n일째 진행중
                </span>
                <div className="card_text">
                  카드 내용
                </div>
                <div className="tag_wrap">
                  <div className="tag">
                    👩🏻‍💻<span>40</span>
                  </div>
                  <div className="tag">
                    🔥<span>16</span>
                  </div>
                  <div className="tag">
                    🤍<span>8</span>
                  </div>
                </div>
              </div>
              <div className="card"></div>
              <div className="card"></div>
            </div>
          </div>
          <div className="modal_wrap">
            <div className="modal">
              <div className="modal_title">모달 타이틀</div>
              <div className="modal_sub_text">모달 서브텍스트</div>
              <div className="input_container">
                <label htmlFor="">비밀번호</label>
                <div className="input_wrap">
                  <input type="text" placeholder='비밀번호를 입력해 주세요.' />
                  <div className="password_toggle_btn"></div>
                </div>
              </div>
              <div className="modal_btn btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 252 54" fill="none">
                  <path d="M25.6491 0.0324321C27.1731 0.0684321 230.297 0.00243214 232.523 0.0324321C237.269 0.110432 248.513 -0.00356827 250.745 8.79843C253.349 19.0764 251.243 40.9404 250.247 44.5764C249.257 48.2124 247.523 53.9964 238.517 53.9964H16.0851C14.5971 53.9964 3.19715 53.4204 1.21115 42.5124C-0.768853 31.6104 0.221147 16.5744 0.449147 13.3104C0.677147 10.0524 1.29515 1.04043 12.3651 0.374432C19.2411 -0.0335681 22.8951 -0.0335679 25.6491 0.0324321Z" fill="#578246"/>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 252 54"
                  className="shadow"
                >
                  <path
                    d="M25.6491 0.0296702C27.1731 0.0656702 230.297 -0.000329804 232.523 0.0296702C237.269 0.10767 248.513 -0.00632973 250.745 8.79567C253.349 19.0737 251.243 40.9377 250.247 44.5737C249.257 48.2097 247.523 53.9937 238.517 53.9937H16.0851C14.5971 53.9937 3.19715 53.4177 1.21115 42.5097C-0.768853 31.6077 0.221147 16.5717 0.449147 13.3077C0.677147 10.0497 1.29515 1.03767 12.3651 0.37767C19.2471 -0.0363298 22.9011 -0.0303298 25.6491 0.0296702Z"
                    fill="#99C08E"
                  />
                </svg>
                <span className='shadow'>수정하러 가기</span>
                <span>수정하러 가기</span>
              </div>
              <div className="modal_close_btn">
                나가기
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DesignExample;
